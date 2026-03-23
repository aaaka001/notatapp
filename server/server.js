const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

let notes = []
let todos = []

app.get("/notes", (req, res) => {
    res.json(notes)
})

app.post("/notes", (req, res) => {
    notes.push(req.body)
    res.json({ message: "Notat lagret" })
})

app.get("/todos", (req, res) => {
    res.json(todos)
})

app.post("/todos", (req, res) => {
    todos.push(req.body)
    res.json({ message: "Todo lagret" })
})

app.listen(3000, () => {
    console.log("Server kjører på port 3000")
})