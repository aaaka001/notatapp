const express = require("express")
const cors = require("cors")

const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./database.db")

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
    title TEXT
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

const app = express()
app.use(cors())
app.use(express.json())

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
    const { title } = req.body
    db.run("INSERT INTO todos (title) VALUES (?)", [title], function(err) {
        if (err) return res.status(500).json(err)
        res.json({ id: this.lastID, title })
    })
})

app.listen(3000, () => {
    console.log("Server kjører på port 3000") // På Proxmoxen blir det 192.168.20.60:3000/notes for å sjekke nettsiden min.
})