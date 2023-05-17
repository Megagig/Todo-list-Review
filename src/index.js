import './style.css';
import { completedTo, incompleteTo } from './modules/updatestatus.js';

// Select elements and store them in variables
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-Input');
const form = document.querySelector('form');

// Retrieves the tasks from local storage and parses it as JSON
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editTodoDescription;
let deleteTodo;
// Saves the tasks to local storage as a JSON string
const saveTodos = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getTasksFromLocalStorage = () => {
  try {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error('Error parsing tasks from local storage:', error);
    tasks = [];
  }
};

getTasksFromLocalStorage();
// Create a function that creates a new todo list item
const createTodoListItemEl = (task) => {
  const deleteButton = document.createElement('button');
  const listItemEl = document.createElement('li');
  const iconEl = document.createElement('i');
  const descriptionEl = document.createElement('span');

  const checkboxEl = document.createElement('input');
  checkboxEl.type = 'checkbox';
  checkboxEl.checked = task.completed;

  checkboxEl.addEventListener('change', () => {
    if (checkboxEl.checked) {
      completedTo(task);
    } else {
      incompleteTo(task);
    }
    saveTodos();
    // check if the checkbox is checked
    if (checkboxEl.checked) {
      deleteButton.style.display = 'block';
      iconEl.style.display = 'none';
      listItemEl.style.display = 'flex';
      listItemEl.style.justifyContent = 'flex-start';
      deleteButton.style.marginLeft = 'auto';
    } else {
      deleteButton.style.display = 'none';
      iconEl.style.display = 'block';
      descriptionEl.style.color = '#999';
    }
  });

  descriptionEl.textContent = task.description;
  descriptionEl.addEventListener('click', () => {
    editTodoDescription(task);
  });

  listItemEl.appendChild(checkboxEl);
  listItemEl.appendChild(descriptionEl);

  iconEl.classList.add('uil', 'uil-ellipsis-v');
  iconEl.addEventListener('click', () => {
    editTodoDescription(task);
  });

  listItemEl.appendChild(iconEl);

  deleteButton.innerHTML = '<i class="uil uil-trash"></i>';
  deleteButton.classList.add('delete-button');
  deleteButton.style.display = 'none';

  deleteButton.addEventListener('click', () => {
    deleteTodo(task.index);
  });

  listItemEl.appendChild(deleteButton);
  return listItemEl;
};

// Update the "index" property of each task object in the "tasks" array.
const updateTodoIndexes = () => {
  tasks.forEach((task, index) => {
    task.index = index;
  });
};

// Clear the existing todo list and renders a new todo list based on the "tasks" array.
const renderTodoList = () => {
  todoList.innerHTML = '';
  tasks
    .sort((task1, task2) => task1.index - task2.index)
    .forEach((task) => {
      const listItemEl = createTodoListItemEl(task);
      todoList.appendChild(listItemEl);
    });
};

// Delete the specified task object from the "tasks" array, update the "index" property.
deleteTodo = (index) => {
  tasks = tasks.filter((task) => task.index !== index);
  updateTodoIndexes();
  saveTodos();
  renderTodoList();
};

// Replace the description of the specified "task" object with an input element.
editTodoDescription = (task) => {
  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.value = task.description;
  inputEl.classList.add('edit-input');

  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      task.description = inputEl.value.trim();
      saveTodos();
      renderTodoList();
    } else if (event.key === 'Escape') {
      renderTodoList();
    }
  });

  const listItemEl = todoList.children[task.index];
  listItemEl.replaceChild(inputEl, listItemEl.children[1]);
  inputEl.select();
};

// Create a new task object with the specified "description", add it to the "tasks" array.
function addNewTodo(description) {
  const taskIndex = tasks.length + 1;

  const task = { description, completed: false, index: taskIndex };
  tasks.push(task);
  saveTodos();

  const listItemElement = createTodoListItemEl(task);
  todoList.appendChild(listItemElement);
}

// Clear the "completed" property of the specified task object.
const deletecompletedTodo = () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTodos();
  renderTodoList();
  updateTodoIndexes();
};

const deletecompleted = document.querySelector('p');
deletecompleted.addEventListener('click', (event) => {
  event.preventDefault();
  deletecompletedTodo();
});
// Add an event listener that listens for a "submit" event on the form element.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const todoDescription = todoInput.value;
  if (todoDescription.trim() === '') {
    return;
  }
  addNewTodo(todoDescription);
  todoInput.value = '';
});

renderTodoList();
window.addEventListener('load', renderTodoList);
