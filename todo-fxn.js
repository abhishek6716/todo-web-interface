'use strict'

// fetching existing todos from localstorage
const getSavedTodos = () => {
    const todosJSON = localStorage.getItem('todos')

    try{
        return notesJSON !== null ? JSON.parse(notesJSON) : []
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

    filteredTodos.forEach((todo) => {
        document.querySelector('#todos').appendChild(generateTodoDOM(todo))
    })
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
    const todoEl = document.createElement('div')
    const checkBox = document.createElement('input')
    const todoText = document.createElement('span')
    const removeButton = document.createElement('button')

    // setup the todo checkBox
    checkBox.setAttribute('type', 'checkbox')
    checkBox.checked = todo.completed
    todoEl.appendChild(checkBox)
    checkBox.addEventListener('change', () => {
        toggleTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters) 
    })

    // setup todo text
    todoText.textContent = todo.text
    todoEl.appendChild(todoText)

    // setup the remove button
    removeButton.textContent = 'x'
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
    summary.textContent = `You have ${incompleteTodos.length} todos left`
    return summary
}