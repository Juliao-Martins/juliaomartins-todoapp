// CSRF TOKEN
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');



const span = document.getElementsByTagName('span')[0];


// catch my website link here!
const myLink = window.location.href;

// define a function for build a list 
// from this url http://127.0.0.1:8000/api/task-list/
const buildList = () => {
    const url = `${myLink}api/task-list/`;
    // console.log("GET data from", url);

    const todoContainer = document.getElementById('todo-container');
    let item = '';
    todoContainer.innerHTML = '';

    fetch(url)
        .then(resp => resp.json())
        .then(function(data) {
            data.map(value => {
                item += `<div class="todo">
                    <span class="title">${value.title}</span>

                    <button class="edit" style="cursor: pointer; display: flex; justify-content: center; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </button>

                    <button class="delete" style="cursor: pointer; display: flex; justify-content: center; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>`;

                todoContainer.innerHTML = item;

            });

             // Edit function here
             const edit = document.getElementsByClassName('edit');
                
             data.map((value, index) => {
                 edit[index].addEventListener('click', () => {
                     editTask(value);
                 });
             });

             // Delete function here
             const deleted = document.getElementsByClassName('delete');
                
             data.map((value, index) => {
                 deleted[index].addEventListener('click', () => {
                     deleteTask(value);
                 });
             });

        });
}


// call buildList function here!
buildList();


// define variable activeItem to edit here!
let activeItem = null;


// catch form here 
const myForm = document.getElementById('myform');
// cath input here!
const userTodo = document.getElementById('user-todo');

// handled submit from form here!
myForm.addEventListener('submit', e => {
    // move span from input fill
    span.classList.remove('move-span');

    e.preventDefault(); // handled default submit

    // POST data to http://127.0.0.1:8000/api/task-create/
    let url = `${myLink}api/task-create/`;
    // console.log(url);

    // check if activeItem is not null
    // POST data to http://127.0.0.1:8000/api/<str:pk>/task-edit/
    if (activeItem !== null) {
        url = `${myLink}api/${activeItem.id}/task-edit/`;
        activeItem = null; // reassign active item to null
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'title': userTodo.value}),
    }).then(function(resp) {
        // after POST data and rebuild list
        // with call buildList function
        buildList();
        myForm.reset();
    });

});


// define editTask function here
const editTask = value => {
    activeItem = value;
    // refill user input here!
    userTodo.value = activeItem.title;

    // toggle move span from input fill
    span.classList.add('move-span');
}


// define deleteTask function here
const deleteTask = value => {
    // DELETE data to http://127.0.0.1:8000/api/<str:pk>/task-delete/
    const url = `${myLink}api/${value.id}/task-delete`;

    // console.log('DELETED =>', url);

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'Application/json',
            'X-CSRFToken': csrftoken,
        },
    }).then(function() {
        // after DELETE data and rebuild list
        // with call buildList function
        buildList();
    });
}


const langContainer = document.querySelector('.lang-container'),
lang = document.querySelector('.lang');


langContainer.addEventListener('mouseenter', () => {
    lang.style.display = 'block';
});

langContainer.addEventListener('click', () => {
    lang.style.display = 'block';
});

langContainer.addEventListener('mouseleave', () => {
    lang.style.display = 'none';
});



// english, indonesia, tetum
const inputCaption = {
    te: "Ohin loron ita halo saida?",
    indo: "Apa yang kau kerjakan hari ini?",
    en: "What are you doing today?",
}

const labelLang = {
    te: "Hili ita nia dalen",
    indo: "Pilih bahasamu",
    en: "Choose your language",
}

const chooseLang = document.querySelector('.choose-lang');

const changeLang = value => {

    localStorage.setItem('language', value);

    span.innerText = inputCaption[`${localStorage.getItem('language')}`];
    chooseLang.innerText = labelLang[`${localStorage.getItem('language')}`];

}

// reassign element content here with window storage API
if (localStorage.getItem('language')) {
    span.innerText = inputCaption[`${localStorage.getItem('language')}`];
    chooseLang.innerText = labelLang[`${localStorage.getItem('language')}`];
}