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