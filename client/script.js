async function saveNote() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value

    await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })
}

async function loadNotes() {
    const res = await fetch("http://localhost:3000/notes")
    const notes = await res.json()

    document.getElementById("notes").innerHTML =
        notes.map(n => `<h3>${n.title}</h3><p>${n.content}</p>`).join("")
}