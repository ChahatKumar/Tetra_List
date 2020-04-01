const clear =document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list=document.getElementById("list");
const input=document.getElementById("input");

const CHECK="fa-check-circle";
const UNCHECK="fa-circle-thin";
const LINE_THROUGH="lineThrough";


let LIST,id;
let data=localStorage.getItem("TODO");

if(data){
    LIST=JSON.parse(data);
    id=LIST.length;
    loadList(LIST);
}
else{
    LIST=[];
    id=0;
}

function loadList(array){
    array.forEach(function(item){
        addTodo(item.name,item.id,item.done,item.trash);
    });
}

clear.addEventListener("click",function(){
    localStorage.clear();
    location.reload();
});


const options={ weekday : "long" , month : "short" , day:"numeric"};
const today =new Date();
dateElement.innerHTML=today.toLocaleDateString("en-US",options);

function addTodo(toDo,id,done,trash){
    if(trash){
        return;
    }
    const DONE = done? CHECK:UNCHECK;
    const LINE =done?LINE_THROUGH:"";

    const item=`<li class="item">
               <i class="fa ${DONE} co" job ="complete" id="${id}"></i>
               <span class="text ${LINE}">${toDo}</span>
               <i class="fa fa-volume-up" job="speak"></i>
               <i class="fa fa-trash-o de " job="delete" id="${id}"></i>
               </li>
               `;

    const position="beforeend";
    list.insertAdjacentHTML(position,item);
}
window.addEventListener("keyup",function(event){
    if(event.keyCode==13){
        const toDo =input.value;
        if(toDo){
            addTodo(toDo,id,false,false);
            LIST.push({
                name : toDo,
                id:id,
                done:false,
                trash:false
            });
           window.localStorage.setItem("TODO",JSON.stringify(LIST));
            id++;
        }
        input.value="";
    }
});
function completeToDoElement(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    LIST[element.id].done=LIST[element.id].done?false:true;
}
function removeToDO(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash=true;
}

list.addEventListener("click",function(event){

   const element=event.target;
   const elementJob= element.attributes.job.value;
   if(elementJob=="complete"){
       completeToDoElement(element);
   }
   else if(elementJob=="delete"){
       removeToDO(element);
   }
   else if(elementJob=="speak"){
       const text = element.parentNode.innerText;
       speaktext(text);
   }

 window.localStorage.setItem("TODO",JSON.stringify(LIST));
});


window.SpeechRecognition = window.SpeechRecognition       ||
                                 window.webkitSpeechRecognition ;
         
        // record
        var recognizer = new window.SpeechRecognition()
          function record(){
            recognizer.start();
        }
        recognizer.onresult = function(event) {
          
          for (var i = event.resultIndex; i < event.results.length; i++) {
            
               const toDo = event.results[i][0].transcript ;
               addTodo(toDo,id,false,false);
          }
        };
        //speak
        function speaktext(text){
        var synth = window.speechSynthesis;
        var utter= new SpeechSynthesisUtterance(text);
        synth.speak(utter);    
        }
    