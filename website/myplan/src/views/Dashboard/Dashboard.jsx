import './Dashboard.css';
import { DashboardTopMenu } from '../../components/dashboard-top-menu/DashboardTopMenu';
import { Column } from '../../components/column/Column';
import data from './data';
import { DragDropContext } from 'react-beautiful-dnd';
import React, { Component } from 'react';
import { addColumn, createCard, deleteCard, deleteColumn, getDashboardDetails, updateCardPosition, updateColumnInfo, updateDashboardBackground } from '../../middleware/dashboardApi';
import { useParams } from 'react-router-dom';
import { AddListControls } from '../../components/add-list-controls/AddListControls';


export class Dashboard extends Component {
    state = null;
    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        console.log(result);
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        const startColumnInd = this.state.columns.findIndex(column => column.id == parseInt(source.droppableId));
        const finishColumnInd = this.state.columns.findIndex(column => column.id == parseInt(destination.droppableId));
        const startColumn = this.state.columns[startColumnInd];
        const finishColumn = this.state.columns[finishColumnInd];

        const draggableCardInd = startColumn.cards.findIndex(card => card.id == parseInt(draggableId));
        let draggableCard = startColumn.cards[draggableCardInd];
        console.log(draggableCard);
        console.log(source.index, destination.index);
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
            console.log(finishColumn);
            updateCardPosition(draggableCard.id, source.index, destination.index, finishColumn.id)
                .then((response) => {
                    console.log(response);
                    if (response.status !== 200) {
                        alert("Error");
                        this.setState(prevState);
                    }
                })

        }
        // moving to the other column
        else {
            console.log("MOVING TO OTHER COLUMN");
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
            console.log(newColumns);
            const newState = {
                ...this.state,
                columns: newColumns
            };
            let prevState = { ...this.state };
            this.setState(newState);

            updateCardPosition(draggableCard.id, source.index, destination.index, finishColumn.id)
                .then((response) => {
                    console.log(response);
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
        console.log(dashboardId);
        getDashboardDetails(dashboardId).then(response => {
            this.setState(response.result);
        });
    }
    addCardHook = (content, columnId) => {
        createCard(content, columnId).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.result)
                let colInd = this.state.columns.findIndex((column) => column.id == columnId);
                console.log(colInd);
                let newColumnsState = Array.from(this.state.columns);
                console.log(newColumnsState);
                newColumnsState[colInd].cards.push(response.result);
                console.log(newColumnsState);
                this.setState({ ...this.state, columns: newColumnsState })
            }
        })
    }
    deleteCardHook = (cardId) => {
        deleteCard(cardId).then((response) => {
            console.log(response);
            if (response.status === 200) {
                let newColumns = Array.from(this.state.columns);
                for (let i = 0; i < newColumns.length; i++) {
                    newColumns[i].cards = newColumns[i].cards.filter(card => card.id != cardId)
                }
                this.setState({ ...this.state, columns: newColumns });
            }
        })
    }
    addColumnHook = (dashboardId, listName) => {

        addColumn(dashboardId, listName).then((response) => {
            console.log(response);
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
                newColumns = newColumns.filter(column => column.id != id);
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
        updateDashboardBackground(this.state.id,backgroundName).then((response)=>{
            if(response.status===200){
                this.setState({...this.state,background:backgroundName});
            }
        })
    }
    render() {
       
        if (this.state === null) return <>Loading</>
        let backgroundImg = require(`../../images/${this.state.background}`);
        return (
            <>
                <div class="dashboard-container" style={{ backgroundImage:`url(${backgroundImg})`}}>
                    <DashboardTopMenu name={this.state.name} changeBackgroundHook={this.changeBackgroundHook} />
                    <div class="cards-table">
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {this.state.columns.map((column, columnId) => {
                                const cards = column.cards;
                                return <Column column={column}
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
                        <AddListControls dashboardId={this.dashboardId} addColumnHook={this.addColumnHook}></AddListControls>

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