import React from 'react'
import { useState } from 'react'
import { addColumn } from '../../middleware/dashboardApi';
import './AddListControls.css'
export const AddListControls = ({dashboardId,addColumnHook}) => {

    const [isSecondStage, setSecondStage] = useState(false);
    const [listName,setListName] = useState("");
    const toggleStage = () => setSecondStage(!isSecondStage);

    const addList = () =>{
        if(listName.length==0) {
            alert("List title can't be empty");
            return;
        }
        addColumnHook(dashboardId,listName);
        
    }
    return (
        <div id="add-list-controls">
            {
                isSecondStage ?
                    <>
                        <input type="text" id="add-list-input" placeholder="Enter list title" onInput={(e)=>setListName(e.target.value)}/>
                        <div id="add-list-buttons">
                            <button id="confirm-list" onClick={addList}>Add</button>
                            <button id="cancel-list" onClick={toggleStage} >X</button>
                        </div>
                    </>
                    :
                    <button id="add-list" onClick={toggleStage}>Add new list</button>
            }

        </div>
    )
}
