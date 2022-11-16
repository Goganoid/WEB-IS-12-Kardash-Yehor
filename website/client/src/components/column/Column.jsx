import React from 'react'
import './Column.css'
import { Card } from '../card/Card'
import { Droppable } from 'react-beautiful-dnd'
import { Editable } from '../Editable/Editable'
export const Column = ({column,cards,addCard,deleteCardHook,renameColumnHook,deleteColumnHook,disabled}) => {

    const addCardOnEnter = (e)=>{
        if(e.keyCode === 13){
            if(e.target.value.length===0){
                alert("Card title can't be empty");
                return;
            }
            addCard(e.target.value,column.id);
        }
    }



    const deleteColumn = (e)=>{
        e.preventDefault();
        deleteColumnHook(column.id);
      }

  return (
    <>
    <div className="list">
            <div className="list-header">
                <div className="list-name">
                    <Editable hook={(name)=>{
                        renameColumnHook(name,column.id);
                    }}
                    disabled={disabled}
                    >
                        <span>{column.name}</span>
                    </Editable>
                    </div>
                    {
                        !disabled
                        ?
                        <div className="list-menu-button" onClick={deleteColumn}>
                        <i className="fa-regular fa-circle-xmark"></i>
                        </div>
                        :
                        null
                    }
               
                
            </div>
            <Droppable droppableId={column.id.toString()}>
                {(provided)=>
                <div className="list-items" 
                ref={provided.innerRef}
                {...provided.droppableProps}
                >
                    {cards.map((card,index)=>
                    <Card card={card} key={card.id} index={index} deleteCardHook={deleteCardHook} disabled={disabled}></Card>
                    )}
                    {provided.placeholder}
                </div>
                }
            </Droppable>
            {
                !disabled
                ?
                <div className="add-control">
                    <input className="new-card-input fade-hover" type="text" placeholder=" + Add new card"
                    onKeyDown={addCardOnEnter}
                    />
                </div>
                :
                null
            }
            
    </div>
    
    </>
  )
}
