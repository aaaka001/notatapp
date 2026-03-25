const SERVER_URL = "http://192.168.20.60:3000"

async function saveNote() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value

    await fetch(`${SERVER_URL}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })

    loadNotes()
}

async function loadNotes() {
    const res = await fetch(`${SERVER_URL}/notes`)
    const notes = await res.json()

    document.getElementById("notes").innerHTML =
        notes.map(n => `<h3>${n.title}</h3><p>${n.content}</p>`).join("")
}

async function saveTodo() {
    const title = document.getElementById("todoTitle").value
    if (!title) return

    await fetch(`${SERVER_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    })

    document.getElementById("todoTitle").value = ""
    loadTodos()
}

async function loadTodos() {
    const res = await fetch(`${SERVER_URL}/todos`)
    const todos = await res.json()
    document.getElementById("todoList").innerHTML =
        todos.map(t => `<li>${t.title}</li>`).join("")
}

window.onload = () => {
    loadNotes()
    loadTodos()
}