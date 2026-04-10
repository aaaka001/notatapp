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
    const res = await fetch(`${SERVER_URL}/notes`, {
        headers: getHeaders()
    })
    const notes = await res.json()

    document.getElementById("notes").innerHTML =
        notes.map(n => `
            <div>
                <h3>${n.title}</h3>
                <p>${n.content}</p>
                <button onclick="editNote(${n.id}, '${n.title.replace(/'/g, "\\'")}', '${n.content.replace(/'/g, "\\'")}')">Rediger</button>
                <button onclick="deleteNote(${n.id})">Slett</button>
            </div>
        `).join("")
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
    const res = await fetch(`${SERVER_URL}/todos`, {
        headers: getHeaders()
    })
    const todos = await res.json()

    document.getElementById("todoList").innerHTML =
        todos.map(t => `
            <li class="${t.completed ? 'completed' : ''}">
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTodo(${t.id}, this.checked)">
                <span>${t.title}</span>
                <button onclick="editTodo(${t.id}, '${t.title.replace(/'/g, "\\'")}')">Rediger</button>
                <button onclick="deleteTodo(${t.id})">Slett</button>
            </li>
        `).join("")
}

async function deleteNote(id) {
    await fetch(`${SERVER_URL}/notes/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })
    loadNotes()
}

function editNote(id, title, content) {
    editingNoteId = id
    document.getElementById("title").value = title
    document.getElementById("content").value = content
    document.getElementById("saveBtn").textContent = "Oppdater notat"
}

async function deleteTodo(id) {
    await fetch(`${SERVER_URL}/todos/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })
    loadTodos()
}

function editTodo(id, title) {
    editingTodoId = id
    document.getElementById("todoTitle").value = title
    document.getElementById("saveTodoBtn").textContent = "Oppdater"
}

async function toggleTodo(id, completed) {
    // Update the database
    await fetch(`${SERVER_URL}/todos/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ completed: completed ? 1 : 0 })
    })
    
    // Update the UI immediately without re-rendering the whole list
    const checkbox = event.target;
    const li = checkbox.closest('li');
    const span = li.querySelector('span');
    
    if (completed) {
        li.classList.add('completed');
        span.style.textDecoration = 'line-through';
        span.style.color = '#6c757d';
        li.style.opacity = '0.6';
    } else {
        li.classList.remove('completed');
        span.style.textDecoration = 'none';
        span.style.color = '';
        li.style.opacity = '';
    }
}


window.onload = () => {
    loadNotes()
    loadTodos()
}