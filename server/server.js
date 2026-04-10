const express = require("express")
const cors = require("cors")

const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./database.db")

const API_KEY = "8080"

db.run(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    completed INTEGER DEFAULT 0
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo_id INTEGER,
    text TEXT,
    done INTEGER
)
`)

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) console.error(err)
    console.log("Tabeller i databasen:", tables)
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("../client"))

app.use((req, res, next) => {
    const key = req.headers["x-api-key"]

    if (key !== API_KEY) {
        return res.status(403).json({ error: "Forbidden" })
    }

    next()
})

app.get("/notes", (req, res) => {
    db.all("SELECT * FROM notes", [], (err, rows) => {
        if (err) {
            return res.status(500).json(err)
        }
        res.json(rows)
    })
})

app.post("/notes", (req, res) => {
    const { title, content } = req.body

    db.run(
        "INSERT INTO notes (title, content) VALUES (?, ?)",
        [title, content],
        function (err) {
            if (err) {
                return res.status(500).json(err)
            }

            res.json({
                id: this.lastID,
                title,
                content
            })
        }
    )
})

app.get("/todos", (req, res) => {
    db.all("SELECT * FROM todos", [], (err, rows) => {
        if (err) return res.status(500).json(err)
        res.json(rows)
    })
})

app.post("/todos", (req, res) => {
    const { title, completed = 0 } = req.body
    if (!title) return res.status(400).json({ error: "Tittel mangler" })

    db.run("INSERT INTO todos (title, completed) VALUES (?, ?)", [title, completed], function(err) {
        if (err) return res.status(500).json(err)
        res.json({ id: this.lastID, title, completed })
    })
})

app.patch("/todos/:id", (req, res) => {
    const { title, completed } = req.body
    const { id } = req.params

    let query = "UPDATE todos SET "
    let params = []
    let updates = []

    if (title !== undefined) {
        updates.push("title = ?")
        params.push(title)
    }
    if (completed !== undefined) {
        updates.push("completed = ?")
        params.push(completed)
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: "Ingen oppdateringer spesifisert" })
    }

    query += updates.join(", ") + " WHERE id = ?"
    params.push(id)

    db.run(query, params, function (err) {
        if (err) return res.status(500).json(err)
        res.json({ updated: this.changes })
    })
})

app.delete("/todos/:id", (req, res) => {
    const { id } = req.params

    db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json(err)
        res.json({ deleted: this.changes })
    })
})

app.patch("/notes/:id", (req, res) => {
    const { title, content } = req.body
    const { id } = req.params

    db.run(
        "UPDATE notes SET title = ?, content = ? WHERE id = ?",
        [title, content, id],
        function (err) {
            if (err) return res.status(500).json(err)
            res.json({ updated: this.changes })
        }
    )
})

app.delete("/notes/:id", (req, res) => {
    const { id } = req.params

    db.run("DELETE FROM notes WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json(err)
        res.json({ deleted: this.changes })
    })
})



app.listen(3000, () => {
    console.log("Server kjører på port 3000") // På Proxmoxen blir det 192.168.20.60:3000/notes for å sjekke serveren.
})