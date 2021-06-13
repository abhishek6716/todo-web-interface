'use strict'

// fetching existing todos from localstorage
const getSavedTodos = () => {
    const todosJSON = localStorage.getItem('todos')

    try{
        return todosJSON !== null ? JSON.parse(todosJSON) : []
    } catch(e){
        return []
    }
}

// saving todos
const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

// render todos
const renderTodos = (todos, filters) => {
    let filteredTodos = todos.filter( (todo) => todo.text.toLowerCase().includes(filters.searchText.toLowerCase()) )

    filteredTodos = filteredTodos.filter( (todo) => {
        if (filters.hideCompleted) {
            return !todo.completed
        } else {
            return true
        }
    })

    const incompleteTodos = filteredTodos.filter( (todo) => !todo.completed )

    document.querySelector('#todos').innerHTML = ''
    document.querySelector('#todos').appendChild(generateSummaryDOM(incompleteTodos))

    if(filteredTodos.length > 0){
        filteredTodos.forEach((todo) => {
            document.querySelector('#todos').appendChild(generateTodoDOM(todo))
        })
    } else{
        const messageEl = document.createElement('p')
        messageEl.classList.add('empty-message')
        messageEl.textContent = 'No todos to show!'
        document.querySelector('#todos').appendChild(messageEl)
    }
}

// remove a todo from the list by id
const removeTodo = (id) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id)
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
    }
}

// toggle the completed value for given todo
const toggleTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id)
    if(todo !== undefined){
        todo.completed = !todo.completed
    }
}

// generate DOM
const generateTodoDOM = (todo) => {
    const todoEl = document.createElement('label')
    const containerEl = document.createElement('div')
    const checkBox = document.createElement('input')
    const todoText = document.createElement('span')
    const removeButton = document.createElement('button')

    // setup the todo checkBox
    checkBox.setAttribute('type', 'checkbox')
    checkBox.checked = todo.completed
    containerEl.appendChild(checkBox)
    checkBox.addEventListener('change', () => {
        toggleTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters) 
    })

    // setup todo text
    todoText.textContent = todo.text
    containerEl.appendChild(todoText)

    // setup container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    // setup the remove button
    removeButton.textContent = 'remove'
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () => {
        removeTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })

    return todoEl
}

// get DOM elements for summary
const generateSummaryDOM = (incompleteTodos) => {
    const summary = document.createElement('h2')
    const plural = incompleteTodos.length === 1 ? '' : 's'
    summary.classList.add('list-title')
    summary.textContent = `You have ${incompleteTodos.length} todo${plural} left`
    return summary
}