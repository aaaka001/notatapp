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

async function saveTodo() {
    const title = document.getElementById("todoTitle").value
    if (!title) return

    await fetch("http://192.168.20.60:3000/todos", { // Bruk IP-en til Proxmox
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    })

    document.getElementById("todoTitle").value = ""
    loadTodos() // Oppdater lista
}

async function loadTodos() {
    const res = await fetch("http://192.168.20.60:3000/todos")
    const todos = await res.json()

    document.getElementById("todoList").innerHTML =
        todos.map(t => `<li>${t.title}</li>`).join("")
}

window.onload = () => {
    loadNotes()
    loadTodos()
}