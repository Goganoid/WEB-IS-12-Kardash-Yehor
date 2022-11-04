import React from 'react'
import './Card.css'
import { Draggable } from 'react-beautiful-dnd'
export const Card = (props) => {

  const deleteListItem = (e)=>{
    e.preventDefault();
    props.deleteCardHook(props.card.id);
  }
  return (
    <Draggable draggableId={props.card.id.toString()} index={props.index}>
        {
            (provided) =>(
                <div class="list-item" 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                  <div className="list-item-content">
                    {props.card.content}
                  </div>
                  <button className="delete-list-item" onClick={deleteListItem}
                  >
                    <i class="fa-regular fa-circle-xmark"></i>
                  </button>
                  </div>
            )
        }
        
    </Draggable>
  )
}
