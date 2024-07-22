const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const textAreaInput = document.querySelector('#textAreaInput')
const dateInput = document.querySelector('#dateInput')
const searchEngine = document.querySelector("#search-engine")

async function fetchTasks() {
    const response = await fetch('http://localhost:3000/api/tasks');
    const tasks = await response.json();
    tasks.forEach(task => render(task));
    checkEmptyList()
}

const render = (task) => {
    let classDone = task.done ? "task-title task-title--done" : "task-title";
    let now = new Date().toLocaleDateString();
    if (task.deadline !== '' && now > task.deadline) {
        task.overdue = true;
    }

    const statusClass = task.overdue &&  !task.done ? 'status' : 'status none';


    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                                <div class='visible d-flex'>
                                    <div><span class="${classDone} main-text">${task.text}</span></div>
                                        <div class="task-item__buttons">
                                            <img src="./img/deadline.svg" class='${statusClass}' title="Просрочена!" alt="Done" width="36" height="36">
                                            <button type="button" data-action="done" class="btn-action">
                                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                                            </button>
                                            <button type="button" data-action="delete" class="btn-action">
                                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                                            </button>
                                        </div>
                                </div>
                                <div class='d-flex hiden none'>
                                    <div class='decsription d-flex'><p>Описание: </p> <textarea class="form-control data-block" id="hidenTextArea" rows="3" disabled>${task.description}</textarea></div>
                                    <div class='date d-flex'><p>Дедлайн: ${task.deadline}</p></div>
                                    <div class='date-of-creation d-flex'><p>Дата создания: ${task.date}</p></div>
                                </div>
                        </li>`

    tasksList.insertAdjacentHTML('beforeend', taskHTML)

}

function checkEmptyList() {
    const taskInList = tasksList.querySelectorAll('li')
    if(taskInList.length === 0){
       const emptyList = `<li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/images.png" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">Список дел пуст</div>
                            </li>`
       tasksList.insertAdjacentHTML('afterbegin', emptyList)
    }else{
        const emptyListCounter = document.querySelector('#emptyList')
        emptyListCounter ? emptyListCounter.remove() : null
    }
}


const addTask = async (e) =>{
    e.preventDefault();

    const taskText = taskInput.value
    const taskDescription = textAreaInput.value
    const taskDate = dateInput.value.replace(/0?(\d+)\-0?(\d+)\-(\d+)/, '$3.$2.$1');
    const dateOfCreation = new Date().toLocaleDateString();
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
        description: taskDescription,
        deadline: taskDate,
        date: dateOfCreation,
        overdue: false
    }

    const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    });
    const task = await response.json();
    render(task);

    taskInput.value = ''
    textAreaInput.value = ''
    dateInput.value = ''
    taskInput.focus()
    checkEmptyList()
}

const deleteTask = async (e) => {
    if(e.target.dataset.action == 'delete'){
        const parent = e.target.closest('.list-group-item')

        const id = parent.id

        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'DELETE'
        });
        

        parent.remove()
        checkEmptyList()
    }
}

const doneTask = async (e) => {
    if(e.target.dataset.action == 'done'){
        const parent = e.target.closest('.list-group-item')

        const id = parent.id
        const doneParent = parent.querySelector('.task-title')
        if(doneParent.classList.contains('task-title--done')){
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ done: false })
            });
        } else {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ done: true })
            });
        }

        doneParent.classList.toggle('task-title--done')
    }
}

const showHidenInfo = (e) => {
    if(e.target.dataset.action != 'done' && e.target.dataset.action != 'delete' && e.target.id != 'emptyList'){
    const parent = e.target.closest('.list-group-item')
    const taskTitle = parent.querySelector(".hiden")
    const emptyDescription = taskTitle.querySelector(".decsription")
    const emptyDate = taskTitle.querySelector(".date")
    taskTitle.classList.toggle('none')
    const id = parent.id
    const descriptionText = emptyDescription.textContent;
    const dateText = emptyDate.textContent;
    if (descriptionText == 'Описание:  '){
        emptyDescription.classList.add('none')
    }
    if (dateText == 'Дедлайн: '){
        emptyDate.classList.add('none')
    }
}
}

const searching = () => {
    let val = searchEngine.value.trim()
    let liItems = document.querySelectorAll('#tasksList li')
    if(val != '') {
        liItems.forEach((e) => {
            if(e.innerText.toLowerCase().search(val.toLowerCase()) == -1){
                e.classList.add('none')
            }else{
                e.classList.remove('none')
            }
        })
    }else{
        liItems.forEach((e) => {
                e.classList.remove('none')
    })
}}



form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
tasksList.addEventListener('click', showHidenInfo)
searchEngine.addEventListener('input', searching)
document.addEventListener('DOMContentLoaded', fetchTasks);
