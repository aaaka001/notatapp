const SERVER_URL = "http://192.168.20.60:3000"

let editingNoteId = null
let editingTodoId = null

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "x-api-key": "8080"
    }
}

async function saveNote() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value

    if (editingNoteId) {
        // Update existing note
        await fetch(`${SERVER_URL}/notes/${editingNoteId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ title, content })
        })
        editingNoteId = null
        document.getElementById("saveBtn").textContent = "Lagre notat"
    } else {
        // Create new note
        await fetch(`${SERVER_URL}/notes`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ title, content })
        })
    }

    // Clear form
    document.getElementById("title").value = ""
    document.getElementById("content").value = ""

    loadNotes()
}

async function loadNotes() {
    try {
        const res = await fetch(`${SERVER_URL}/notes`, {
            headers: getHeaders()
        })
        const notes = await res.json()

        document.getElementById("notes").innerHTML =
            notes.map(n => `
                <div data-id="${n.id}">
                    <h3>${n.title}</h3>
                    <p>${n.content}</p>
                    <button class="edit-note-btn" data-note-id="${n.id}" data-title="${n.title.replace(/"/g, '&quot;')}" data-content="${n.content.replace(/"/g, '&quot;')}">Rediger</button>
                    <button class="delete-note-btn" data-note-id="${n.id}">Slett</button>
                </div>
            `).join("")

        // Add event listeners after creating the elements
        document.querySelectorAll('.edit-note-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.noteId)
                const title = e.target.dataset.title
                const content = e.target.dataset.content
                editNote(id, title, content)
            })
        })

        document.querySelectorAll('.delete-note-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.noteId)
                deleteNote(id)
            })
        })
    } catch (error) {
        console.error("Error loading notes:", error)
    }
}

async function saveTodo() {
    const title = document.getElementById("todoTitle").value
    if (!title) return 

    if (editingTodoId) {
        // Update existing todo
        await fetch(`${SERVER_URL}/todos/${editingTodoId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ title })
        })
        editingTodoId = null
        document.getElementById("saveTodoBtn").textContent = "Legg til"
    } else {
        // Create new todo
        await fetch(`${SERVER_URL}/todos`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ title, completed: 0 })
        })
    }

    document.getElementById("todoTitle").value = ""
    loadTodos()
}

async function loadTodos() {
    try {
        const res = await fetch(`${SERVER_URL}/todos`, {
            headers: getHeaders()
        })
        const todos = await res.json()

        document.getElementById("todoList").innerHTML =
            todos.map(t => `
                <li class="${t.completed ? 'completed' : ''}" data-id="${t.id}">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} data-todo-id="${t.id}">
                    <span>${t.title}</span>
                    <button class="edit-btn" data-todo-id="${t.id}" data-title="${t.title.replace(/"/g, '&quot;')}">Rediger</button>
                    <button class="delete-btn" data-todo-id="${t.id}">Slett</button>
                </li>
            `).join("")

        // Add event listeners after creating the elements
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.todoId)
                const title = e.target.dataset.title
                editTodo(id, title)
            })
        })

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.todoId)
                deleteTodo(id)
            })
        })

        document.querySelectorAll('#todoList input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.todoId)
                const completed = e.target.checked
                toggleTodo(id, completed)
            })
        })
    } catch (error) {
        console.error("Error loading todos:", error)
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${SERVER_URL}/notes/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        })
        if (response.ok) {
            loadNotes()
        } else {
            console.error("Delete failed:", response.status)
        }
    } catch (error) {
        console.error("Delete error:", error)
    }
}

function editNote(id, title, content) {
    editingNoteId = id
    document.getElementById("title").value = title
    document.getElementById("content").value = content
    document.getElementById("saveBtn").textContent = "Oppdater notat"
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${SERVER_URL}/todos/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        })
        if (response.ok) {
            loadTodos()
        } else {
            console.error("Delete failed:", response.status)
        }
    } catch (error) {
        console.error("Delete error:", error)
    }
}

function editTodo(id, title) {
    editingTodoId = id
    document.getElementById("todoTitle").value = title
    document.getElementById("saveTodoBtn").textContent = "Oppdater"
}

async function toggleTodo(id, completed) {
    try {
        // Update the database
        const response = await fetch(`${SERVER_URL}/todos/${id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ completed: completed ? 1 : 0 })
        })

        if (response.ok) {
            // Update the UI immediately without re-rendering the whole list
            const checkbox = document.querySelector(`input[data-todo-id="${id}"]`)
            const li = checkbox.closest('li')
            const span = li.querySelector('span')
            
            if (completed) {
                li.classList.add('completed')
                span.style.textDecoration = 'line-through'
                span.style.color = '#6c757d'
                li.style.opacity = '0.6'
            } else {
                li.classList.remove('completed')
                span.style.textDecoration = 'none'
                span.style.color = ''
                li.style.opacity = ''
            }
        } else {
            console.error("Toggle failed:", response.status)
            // Revert checkbox state on error
            const checkbox = document.querySelector(`input[data-todo-id="${id}"]`)
            checkbox.checked = !completed
        }
    } catch (error) {
        console.error("Toggle error:", error)
        // Revert checkbox state on error
        const checkbox = document.querySelector(`input[data-todo-id="${id}"]`)
        checkbox.checked = !completed
    }
}


window.onload = () => {
    loadNotes()
    loadTodos()
}