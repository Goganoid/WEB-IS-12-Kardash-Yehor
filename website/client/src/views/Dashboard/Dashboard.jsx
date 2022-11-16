/* eslint-disable import/no-anonymous-default-export */
import './Dashboard.css';
import { DashboardTopMenu } from '../../components/dashboard-top-menu/DashboardTopMenu';
import { Column } from '../../components/column/Column';
import { DragDropContext } from 'react-beautiful-dnd';
import React, { Component } from 'react';
import { addColumn, createCard, deleteCard, deleteColumn, getDashboardDetails, removeUserFromDashboard, updateCardPosition, updateColumnInfo, updateDashboardBackground, updateDashboardName } from '../../middleware/dashboardApi';
import { useParams } from 'react-router-dom';
import { AddListControls } from '../../components/add-list-controls/AddListControls';
import { addUserToDashBoard } from '../../middleware/dashboardApi';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { getToken } from '../../middleware/storage';


const startSignalRConnection = async connection => {
    try {
        await connection.start();
        console.log('SignalR connection established');
    } catch (err) {
        console.error('SignalR Connection Error: ', err);
        setTimeout(() => startSignalRConnection(connection), 5000);
    }
};

export class Dashboard extends Component {
    state = null;
    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        const startColumnInd = this.state.columns.findIndex(column => column.id === parseInt(source.droppableId));
        const finishColumnInd = this.state.columns.findIndex(column => column.id === parseInt(destination.droppableId));
        const startColumn = this.state.columns[startColumnInd];
        const finishColumn = this.state.columns[finishColumnInd];

        const draggableCardInd = startColumn.cards.findIndex(card => card.id === parseInt(draggableId));
        let draggableCard = startColumn.cards[draggableCardInd];
        // reordering
        if (startColumn === finishColumn) {
            const newCards = Array.from(startColumn.cards);
            newCards.splice(source.index, 1);
            newCards.splice(destination.index, 0, draggableCard);

            const newColumn = {
                ...startColumn,
                cards: newCards,
            };
            const newColumns = Array.from(this.state.columns);
            newColumns.splice(startColumnInd, 1, newColumn);
            const newState = {
                ...this.state,
                columns: newColumns,
            };
            let prevState = { ...this.state }
            this.setState(newState);
            updateCardPosition(draggableCard.id, source.index, destination.index, finishColumn.id)
                .then((response) => {
                    if (response.status !== 200) {
                        alert("Error");
                        this.setState(prevState);
                    }
                })

        }
        // moving to the other column
        else {
            const startCards = Array.from(startColumn.cards);
            startCards.splice(source.index, 1);
            const newStart = {
                ...startColumn,
                cards: startCards
            };
            const finishCards = Array.from(finishColumn.cards);
            finishCards.splice(destination.index, 0, draggableCard);
            const newFinish = {
                ...finishColumn,
                cards: finishCards
            };
            let newColumns = Array.from(this.state.columns);
            newColumns.splice(startColumnInd, 1, newStart);
            newColumns.splice(finishColumnInd, 1, newFinish);
            const newState = {
                ...this.state,
                columns: newColumns
            };
            let prevState = { ...this.state };
            this.setState(newState);

            updateCardPosition(draggableCard.id, source.index, destination.index, finishColumn.id)
                .then((response) => {
                    if (response.status !== 200) {
                        alert("Error");
                        this.setState(prevState);
                    }
                })
        }

    }
    componentDidMount() {
        const { dashboardId } = this.props.params;
        this.dashboardId = dashboardId;
        getDashboardDetails(dashboardId).then(response => {
            this.setState(response.result);


            this.connection = new HubConnectionBuilder()
                .withUrl(`https://localhost:7020/hubs/dashboard/${response.result.id}`, { accessTokenFactory: () => getToken(), dashboardId: response.result.id })
                .withAutomaticReconnect()
                .build();

            this.connection.onclose(error => {
                console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
            });

            this.connection.onreconnecting(error => {
                console.log('Connection lost due to error. Reconnecting.', error);
            });

            this.connection.onreconnected(connectionId => {
                console.log('Connection reestablished. Connected with connectionId', connectionId);
            });

            startSignalRConnection(this.connection);



            this.connection.on('ReceiveMessage', message => {
                console.log(`Recieved message:${message}`)
                getDashboardDetails(dashboardId).then(response => {
                    this.setState(response.result);
                });;
            });

        });
    }
    componentWillUnmount() {
        this.connection.stop();
    }
    addCardHook = (content, columnId) => {
        createCard(content, columnId).then((response) => {
            if (response.status === 200) {
                let colInd = this.state.columns.findIndex((column) => column.id === columnId);
                let newColumnsState = Array.from(this.state.columns);
                newColumnsState[colInd].cards.push(response.result);
                this.setState({ ...this.state, columns: newColumnsState })
            }
        })
    }
    deleteCardHook = (cardId) => {
        deleteCard(cardId).then((response) => {
            if (response.status === 200) {
                let newColumns = Array.from(this.state.columns);
                for (let i = 0; i < newColumns.length; i++) {
                    newColumns[i].cards = newColumns[i].cards.filter(card => card.id !== cardId)
                }
                this.setState({ ...this.state, columns: newColumns });
            }
        })
    }
    addColumnHook = (dashboardId, listName) => {

        addColumn(dashboardId, listName).then((response) => {
            if (response.status === 200) {
                const column = response.result;
                let newColumns = Array.from(this.state.columns);
                newColumns.push(column);
                this.setState({ ...this.state, columns: newColumns });
            }
        })


    }
    deleteColumnHook = (id) => {
        deleteColumn(id).then((response) => {
            if (response.status === 200) {
                let newColumns = Array.from(this.state.columns);
                newColumns = newColumns.filter(column => column.id !== id);
                this.setState({ ...this.state, columns: newColumns });
            }
        })

    }
    renameColumnHook = (name, id) => {
        updateColumnInfo(id, name).then((response) => {
            if (response.status === 200) {
                let newColumns = Array.from(this.state.columns);
                newColumns = newColumns.map(column => {
                    if (column.id === id) column.name = name
                    return column;
                })
                this.setState({ ...this.state, columns: newColumns });
            }
        })
    }
    changeBackgroundHook = (backgroundName) => {
        updateDashboardBackground(this.state.id, backgroundName).then((response) => {
            if (response.status === 200) {
                this.setState({ ...this.state, background: backgroundName });
            }
        })
    }
    removeUserHook = (userToRemoveId) => {
        removeUserFromDashboard(this.state.id, userToRemoveId).then(response => {
            if (response.status === 200) {
                this.setState({ ...this.state, memberships: response.result });
            }
        })
    }
    addUserHook = (email, role) => {
        addUserToDashBoard(this.state.id, email, role).then(response => {
            if (response.status === 200) {
                this.setState({ ...this.state, memberships: response.result });
            }
            else if(response.status===404){
                alert("User does not exist");
            }
            else{
                alert("Unknown error ",response.status);
            }
        })

    }
    changeDashboardNameHook = (name) => {
        updateDashboardName(this.state.id, name).then(response => {
            if (response.status === 200) {
                this.setState({ ...this.state, name });
            }
        });
    }
    render() {

        if (this.state === null) return <>Loading</>
        let backgroundImg = require(`../../images/${this.state.background}`);
        const disabled = this.state.role === 2;
        return (
            <>
                <div className="dashboard-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
                    <DashboardTopMenu name={this.state.name}
                        memberships={this.state.memberships}
                        changeBackgroundHook={this.changeBackgroundHook}
                        changeDashboardNameHook={this.changeDashboardNameHook}
                        addUserHook={this.addUserHook}
                        removeUserHook={this.removeUserHook}
                        role={this.state.role} />
                    <div className="cards-table">
                        <DragDropContext onDragEnd={this.onDragEnd} >
                            {this.state.columns.map((column, columnId) => {
                                const cards = column.cards;
                                return <Column column={column}
                                    disabled={disabled}
                                    cards={cards}
                                    addCard={this.addCardHook}
                                    deleteCardHook={this.deleteCardHook}
                                    renameColumnHook={this.renameColumnHook}
                                    deleteColumnHook={this.deleteColumnHook}
                                    key={columnId}
                                ></Column>;
                            }

                            )}
                        </DragDropContext>
                        {
                            !disabled
                                ?
                                <AddListControls dashboardId={this.dashboardId} addColumnHook={this.addColumnHook}></AddListControls>
                                :
                                null
                        }

                    </div>
                </div>
            </>
        )
    }
}

export default (props) => (
    <Dashboard
        {...props}
        params={useParams()}
    />
);