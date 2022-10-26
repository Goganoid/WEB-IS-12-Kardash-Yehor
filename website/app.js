let addListButton = document.getElementById("add-list");
let addListInput = document.getElementById("add-list-input");
let listControlButtons = document.getElementById("add-list-buttons");
let confirmList = document.getElementById("confirm-list");
let cancelList = document.getElementById("cancel-list");

let board = document.getElementsByClassName("cards-table")[0];


// show add list button or input form
function toggleAddListStage(){
    addListButton.classList.toggle("hidden");
    addListInput.classList.toggle("hidden");
    listControlButtons.classList.toggle("hidden");
}


// update all 'Add Card' inputs
function updateAddCardButtons(){
    let addCardButtons = document.getElementsByClassName("new-card-input");
    for(let i=0; i<addCardButtons.length;i++){
        addCardButtons[i].onkeydown= (e)=>{
                if(e.keyCode == 13){
                    console.log(e);
                    if(e.target.value.length==0){
                        alert("Card title can't be empty");
                        return;
                    }
                    console.log(e.target.parentElement);
                    let list = e.target.parentElement.parentElement.getElementsByClassName("list-items")[0];
                    Card(list,e.target.value);
                }
        }
    }
}
// add card
function Card(list,title){
    list.innerHTML+=`<div class="list-item">${title}</div>`;
}

// add list
function List(name){
    let list = document.createElement("div");
    list.classList.add("list")
    list.innerHTML+= `
    <div class="list-header">
    <div class="list-name">${name}</div>
    <div class="list-menu">
        <i class="fa-solid fa-ellipsis-vertical"></i>
    </div>
    </div>
    <div class="list-items">
    </div>
    <div class="add-control">
    <input class="new-card-input fade-hover" type="text" placeholder=" + Add new card">`;
    board.appendChild(list);
    updateAddCardButtons();
}

addListButton.onclick = ()=>{
    toggleAddListStage();
}
cancelList.onclick = ()=>{
    toggleAddListStage();
}

confirmList.onclick = ()=>{
    console.log(addListInput.value)
    if(addListInput.value.length==0) {
        alert("List title can't be empty");
        return;
    }
    List(addListInput.value);
    toggleAddListStage();   
}

updateAddCardButtons();



