var enterButton = document.getElementById("enter");
var deleteButtons = document.getElementsByClassName("delete")
var input = document.getElementById("userinput");
var ul = document.querySelector("ul");
var brs = document.getElementsByTagName("br")
var listOfItems = document.querySelectorAll("li");


let api = 'http://127.0.0.1:8000/shopping-list'
let data = [];

enterButton.addEventListener("click", (e) => {
    e.preventDefault();
    if(input.value.length > 0){
        createListElement()
        input.value = "";
    }
    else{
        alert("input cannot be blank")
    }
    console.log("addEventListener for add working") 
})

let postShoppingList = () => {
    const name = input.value;
    const xhr = new XMLHttpRequest();
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 201) {
        const newTodo = JSON.parse(xhr.responseText) || [];
        data.push(newTodo);
        // renderTodos();
      }
    };
  
    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({name}));
    // console.log("successfully add to backend") 
};

let getShoppingList = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        data = JSON.parse(xhr.responseText) || [];
        // console.log(data);
        renderTodos();
      }
    };
  
    xhr.open('GET', api, true); 
    xhr.send();
};

let deleteShoppingList = (name) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        data = data.filter((x) => x.name !== name);
        // renderTodos()
      }
    };
    xhr.open('DELETE', `${api}/${name}`, true);
    xhr.send();
    // console.log("successfully delete backend") 
};

let renderTodos = () => {
    ul.innerHTML = '';
    data
      .sort((a, b) => b.id - a.id)
      .map((x) => {
        return (ul.innerHTML += `
          <li>${x.name} <button class="delete">delete</button></li>
          `);
      });
    var deleteButtons = document.getElementsByClassName("delete")
    for(var i = 0; i < deleteButtons.length; i++){
        deleteButtons[i].addEventListener("click", (e) => {
        e.preventDefault();
        removeParent(e);
    });
}
};


function inputLength() {
    return input.value.length;
}

function checkDuplicate(newItem){
    for (var i = 0; i < ul.children.length; i++) {
        if (newItem.innerText === ul.children[i].innerText){
            return true
        }
    }
}

function createDeleteButton(){
    var button = document.createElement("button");
    button.appendChild(document.createTextNode("delete"));
    button.classList.add("delete");
    return button;
}

// void function
function createListElement() {
    var li = document.createElement("li"); // create li tags
    var deleteButton = createDeleteButton();
    var text = document.createTextNode(input.value + " ")
    deleteButton.onclick = removeParent;
    li.appendChild(text); // create text for li tags
    li.appendChild(deleteButton);
    if (checkDuplicate(li) === true){
        alert(`we already have ${input.value} try something else`)
    }else{
        ul.appendChild(li); // append to the ul tag
        postShoppingList(input.value);
    }
}

// void function
function removeParent(event){
    event.target.parentNode.remove();
    textToDel = event.target.parentNode.innerText.replace(" delete","")
    deleteShoppingList(textToDel)
    console.log("removeParent")
}

(()=>{
    getShoppingList();
})();








