const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const textAreaInput = document.querySelector('#textAreaInput')
const dateInput = document.querySelector('#dateInput')
const searchEngine = document.querySelector("#search-engine")

let tasks = []

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

const render = (task) => {
    let classDone
    if(task.done == false){
        classDone = "task-title"
    }else {
        classDone = "task-title task-title--done"
    }

    let now = new Date().toLocaleDateString()
    if(task.deadline != '' && now > task.deadline){
        task.overdue = true
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

tasks.forEach((e) => {
    render(e)
})

checkEmptyList()

function checkEmptyList() {
    if(tasks.length === 0){
       const emptyList = `<li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/images.png" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">Список дел пуст</div>
                            </li>`
       tasksList.insertAdjacentHTML('afterbegin', emptyList)
    }

    if(tasks.length > 0){
        const emptyListCounter = document.querySelector('#emptyList')
        emptyListCounter ? emptyListCounter.remove() : null
    }
}

const saveLocalStorege = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const addTask = (e) =>{

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

    tasks.push(newTask)

    saveLocalStorege()

    render(newTask)

    taskInput.value = ''

    textAreaInput.value = ''

    dateInput.value = ''

    taskInput.focus()

    checkEmptyList()
}

const deleteTask = (e) => {
    if(e.target.dataset.action == 'delete'){
        const parent = e.target.closest('.list-group-item')

        const id = parent.id

        const index = tasks.findIndex((task) => {
            if(task.id == id) {
                return true
            }
        })

        tasks.splice(index, 1)

        saveLocalStorege()

        parent.remove()

        checkEmptyList()
    }
}

const doneTask = (e) => {
    if(e.target.dataset.action == 'done'){
        const parent = e.target.closest('.list-group-item')

        const id = parent.id

        const item = tasks.find((task) => {
            if (task.id == id){
                return true
            }
        })
        item.done = !item.done

        saveLocalStorege()

        if(item.overdue == true){
            const deadlineStatus = parent.querySelector('.status')
            deadlineStatus.classList.toggle('none')
        }


        const doneParent = parent.querySelector('.task-title')
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
        tasks.forEach((e) => {
            if(e.id == id && e.description == ''){
                emptyDescription.classList.add('none')
            }if(e.id == id && e.deadline == ''){
                emptyDate.classList.add('none')
            }
        })
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

