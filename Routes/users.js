const express = require('express')
const bodyParser = require("body-parser")
const router = express.Router()
const mysql = require('mysql')

router.use(bodyParser.json({ extended: false }))

function getConnection() {
    return pool
}

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Family_DB'
})

//MARK:-  get request
router.get("/", (req, res) => {
    const email = req.params.email
    const queryString = "SELECT * FROM users"
    getConnection().query(queryString, [email], (err, rows, fields) => {
        if (err) {
            res.json({ "error": err })
            return
        }
        const users = rows.map((row) => {
            return rows
        })
        res.json({ "users": users.length == 0 ? "No record found" : rows })
    })
})

router.get("/:id", (req, res) =>{
    const userId = req.params.id

    const queryString = "SELECT * FROM users INNER JOIN videos ON users.ID = videos.user_id WHERE users.ID = ?"
    getConnection().query(queryString,[userId], (err, rows, fields) => {
        if (err) {
            res.json({"error" : err})
            return
        }
        const users = rows.map((row) => {
            return { "url" : row.video, "user_id" : row.user_id, "intrest" : row.intrests,"status" : "married","age" : row.age}
        })
        res.json({"users" : users})
    })
})


//MARK:-  post request
router.post('/user_create', (req, res) => {
    console.log("Creating new user2")

    const name = req.body.name
    const age = req.body.age
    const status = req.body.status
    const intrests = req.body.intrests

    console.log(req.body);
    console.log(req.params);

    const queryString = "INSERT INTO users (name, age, status, intrests) VALUES(?, ?, ?, ?)"
    getConnection().query(queryString, [name, age, status, intrests], (err, results, fields) => {
        if (err) {
            res.sendStatus(err)
            return
        }
            res.json({ "status": true, "id": results.insertId });
            res.end()
    })
})


//MARK:-  put request
router.put('/user_edit', (req, res) => {
    console.log("Creating new user")
    console.log(req.body);

    const name = req.body.name
    const age = req.body.age
    const id = req.body.id
    const status = req.body.status
    const intrests = req.body.intrests
    const queryString = "UPDATE users SET name=?,age=?,intrests=?,status=? where id=?"
    getConnection().query(queryString, [name, age, intrests, status, id], (err, results, fields) => {
        if (err) {
            res.json({ "status": false, "Error": err });
            return
        }

        res.json({ "status": true });
        res.end()
    })
})

//MARK:-  delete request

router.delete('/user_delete/:id', (req, res) => {
    console.log("Creating new user")
    console.log(req.body);
    const id = req.params.id
    const queryString = "DELETE FROM users WHERE id = ?"
    getConnection().query(queryString, [id], (err, results, fields) => {
        if (err) {
            res.json({ "status": false, "Error": err });
            return
        }

        res.json({ "status": true });
        res.end()
    })
})
module.exports = router