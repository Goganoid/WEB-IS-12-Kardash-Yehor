import React from 'react'
import { useState } from 'react'
export const Editable = (props) => {
    const disabled = props.disabled ?? false;
    const [showNameInput,setShowNameInput] = useState(false);
    const [inputValue, setValue] = useState(props.children.props.children);

    const toggleShowNameInput = ()=>setShowNameInput(!showNameInput);

    const handleColumnNameChange = (e)=>setValue(e.target.value);

    const changeValueOnEnter = (e)=>{
        if(e.keyCode === 13){
            if(e.target.value.length===0){
                alert("Column title can't be empty");
                return;
            }
            props.hook(e.target.value);
            toggleShowNameInput();
        }
    }
  return (
    <>
    {
        (showNameInput && !disabled) ? 
        (
        <input type="text" value={inputValue} 
        onChange={handleColumnNameChange}
        onKeyDown={changeValueOnEnter}
        onBlur={toggleShowNameInput}
        autoFocus
        />
        )
        :
        (React.cloneElement( props.children, { onClick: toggleShowNameInput } ))
    }
    </>
   
  )
}
