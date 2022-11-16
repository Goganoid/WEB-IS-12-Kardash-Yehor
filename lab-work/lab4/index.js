var count = 0;
function QuickSort(Arr){
    if(Arr.length <= 1){
      return Arr;
    }
  
    const pivot = Arr[Arr.length - 1];
    const leftArr = [];
    const rightArr = [];
  
    for(let i=0; i < Arr.length-1;i++){
      Arr[i] < pivot ? leftArr.push(Arr[i]) :  rightArr.push(Arr[i])
    }
    console.log("Level ",count);
    count++;
    console.log(pivot);
    console.log(leftArr);
    console.log(rightArr)
    return [...QuickSort(leftArr) ,pivot,...QuickSort(rightArr)];
  
  }
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomArray(length,min,max){
    return [...new Array(length)].map(()=>getRandomInt(min,max))
}

const array = randomArray(20,0,100);
const sortedArray = QuickSort(array);
document.getElementById("original").innerText+= `[${array.join(', ')}]`;
document.getElementById("sorted").innerText+= `[${sortedArray.join(', ')}]`; 


const daysOfWeek=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"]


class Calendar{
    constructor(){
        // set date
        let today = new Date();
        this.year = today.getFullYear();
        this.month = today.getMonth();
        this.day = today.getDate();
        this.completed = true;

        // get elements
        this.daysTable = document.getElementById("calendar-table");

        this.yearDisplay =    document  .getElementById("year");
        this.yearNextButton = document  .getElementById("year-next");
        this.yearBackButton = document  .getElementById("year-back");

        this.monthDisplay =    document .getElementById("month");
        this.monthNextButton = document .getElementById("month-next");
        this.monthBackButton = document .getElementById("month-back");

        this.inputForm = document.getElementById("inputDisplay");
        this.submitButton = document.getElementById("submit");
        // configure year and month selector
        this.configureSelector('year',this.yearDisplay,this.yearNextButton,this.yearBackButton,1970,2100);
        this.configureSelector('month',this.monthDisplay,this.monthNextButton,this.monthBackButton,1,12);
        // set calendar and form
        this.update()
        
    }
    // rerender calendar and input form
    update(){
        this.updateDaysTable();
        this.updateInputForm();
    }
    // update form
    updateInputForm(){
        this.inputForm.value = `${this.year}/${this.month}/${this.completed ? this.day : '?'}`;
        this.submitButton.disabled = !this.completed;
    }
    // configure year or month selector, add onclick events
    configureSelector(prop,display,nextButton,backButton,minVal,maxVal){
        display.innerText = this[prop];
        nextButton.onclick = (e)=>{
            e.preventDefault();
            if(this[prop]>=maxVal) return;
            this[prop]++;
            display.innerText = this[prop];
            this.completed = false;
            this.update()

        }
        backButton.onclick = (e)=>{
            e.preventDefault();
            if(this[prop]<=minVal) return;
            this[prop]--;
            display.innerText = this[prop];
            this.completed = false;
            this.update();
        }
    }
    // get days in month
    daysInMonth() { 
        return 32 -  new Date(this.year, this.month, 32).getDate();
    }
    updateDaysTable(){
        const daysInMonth =  this.daysInMonth();
        let rows = Math.ceil(daysInMonth/7);
        let columns = 7;
        // adding cells
        let content = '';
        content+="<table>";
        content+="<tr>";
        for(let day of daysOfWeek){
            content+=`<th>${day}</th>`;
        }
        content+="</tr>";
        for(let row=0;row<rows;row++){
            content+="<tr>";
            for(let column=1;column<=columns;column++){
                let day =7*(row)+column;
                let cellContent = day<=daysInMonth ? day : '';
                content+=`<td value=${cellContent}>${cellContent}</td>`;
            }
            content+="</tr>";
        }
        content+="</table>";
        this.daysTable.innerHTML = content;
        // set cell with current day by default
        if(this.month == new Date().getMonth() 
        && this.year == new Date().getFullYear()
        && document.getElementsByClassName("selected").length==0)
        {
            this.daysTable.querySelector(`td[value="${this.day}"]`).classList.toggle("selected");
            this.completed = true;
        }

        // add onclick events to cells
        let cells = this.daysTable.querySelectorAll("td");

        for(let i=0;i<cells.length;i++){
            cells[i].onclick = (e)=>{
                console.log(e);
                let daySelected = e.target.getAttribute("value");
                if(daySelected=='') return;
                daySelected = parseInt(daySelected)
                // remove previous
                let previousSelected = document.getElementsByClassName("selected")[0];
                previousSelected?.classList.toggle("selected");

                if(daySelected!=this.day){
                    e.target.classList.toggle("selected");
                    this.day = daySelected;
                    this.completed = true;
                }
                else{
                    this.completed = false;
                    
                }
                this.updateInputForm();
            }
        }
    }

}



let calendar = new Calendar();


