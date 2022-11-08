import React from 'react'
import './Column.css'
import { Card } from '../card/Card'
import { Droppable } from 'react-beautiful-dnd'
import { useState } from 'react'
import { Editable } from '../Editable/Editable'
export const Column = ({column,cards,addCard,deleteCardHook,renameColumnHook,deleteColumnHook,disabled}) => {

    const addCardOnEnter = (e)=>{
        if(e.keyCode == 13){
            console.log(e);
            if(e.target.value.length==0){
                alert("Card title can't be empty");
                return;
            }
            addCard(e.target.value,column.id);
        }
    }


    const [showNameInput,setShowNameInput] = useState(false);
    const [columnName, setColumnName] = useState(column.name);

    const toggleShowNameInput = ()=>setShowNameInput(!showNameInput);

    const handleColumnNameChange = (e)=>setColumnName(e.target.value);

    const changeNameOnEnter = (e)=>{
        if(e.keyCode == 13){
            console.log(e);
            if(e.target.value.length==0){
                alert("Column title can't be empty");
                return;
            }
            renameColumnHook(e.target.value,column.id);
            toggleShowNameInput();
        }
    }
    const deleteColumn = (e)=>{
        e.preventDefault();
        deleteColumnHook(column.id);
      }

  return (
    <>
    <div class="list">
            <div class="list-header">

                <div class="list-name">
                    {/* {
                        showNameInput ? 
                        <input type="text" value={columnName} 
                        onChange={handleColumnNameChange}
                        onKeyDown={changeNameOnEnter}
                        onBlur={toggleShowNameInput}
                        autoFocus
                        />
                        :
                        <span onClick={toggleShowNameInput}>{columnName}</span>
                    } */}
                    <Editable hook={(name)=>{
                        renameColumnHook(name,column.id);
                        setColumnName(name);
                    }}
                    disabled={disabled}
                    >
                        <span>{columnName}</span>
                    </Editable>
                    </div>
                    {
                        !disabled
                        ?
                        <div class="list-menu-button" onClick={deleteColumn}>
                        <i class="fa-regular fa-circle-xmark"></i>
                        </div>
                        :
                        null
                    }
               
                
            </div>
            <Droppable droppableId={column.id.toString()}>
                {(provided)=>
                <div class="list-items" 
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
                <div class="add-control">
                    <input class="new-card-input fade-hover" type="text" placeholder=" + Add new card"
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
