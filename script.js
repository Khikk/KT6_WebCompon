class TaskList extends HTMLElement {
    constructor() {
        super();
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.attachShadow({ mode: 'open' });
        this.render();

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'style.css');
        this.shadowRoot.appendChild(linkElem);
    }

    connectedCallback() {
        this.addTaskForm = this.shadowRoot.querySelector('#add-task-form');
        this.addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = this.shadowRoot.querySelector('#title').value;
            this.addTask(title);
        });
    }

    renderTasks() {
        const taskList = this.shadowRoot.querySelector('#task-list');
        taskList.innerHTML = ''; // Очистить список перед перерисовкой

        this.tasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.innerHTML = `
                <div class="tasks">
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                    <label for="task-${task.id}">${task.title}</label>
                    <button class="delete-btn" data-id="${task.id}">Удалить</button>
                </div>`;

            taskElement.querySelector('input').addEventListener('change', (event) => {
                const taskId = task.id;
                this.toggleCompleted(taskId, event.target.checked);
            });

            taskElement.querySelector('.delete-btn').addEventListener('click', (event) => {
                const taskId = event.target.dataset.id;
                this.deleteTask(taskId);
            });

            taskList.appendChild(taskElement);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div class="container">
                <form id="add-task-form">
                    <h1>MY TASKS</h1>
                    <input type="text" id="title" class="inp_task" placeholder="Введите задачу" required>
                    <button type="submit"  class="btn">Добавить</button>
                </form>
                <ul id="task-list"></ul>
            </div>`;
        
        this.renderTasks(); // Отрисовать задачи после рендеринга
    }

    addTask(title) {
        const task = {
            id: Date.now(),
            title: title,
            completed: false
        };
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks(); // Обновить список задач
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== Number(id));
        this.saveTasks();
        this.renderTasks(); // Обновить список задач
    }

    toggleCompleted(id, checked) {
        const taskIndex = this.tasks.findIndex(task => task.id === Number(id));
        if (taskIndex !== -1) {
            this.tasks[taskIndex].completed = checked;
            this.saveTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

window.customElements.define('task-list', TaskList);
