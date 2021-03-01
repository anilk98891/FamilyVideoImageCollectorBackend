const express = require('express')
const bodyParser = require("body-parser")
const router = express.Router() 
const mysql = require('mysql')
const multer = require("multer");
const path = require("path");
const ip = require("ip");

router.use(bodyParser.json({extended: false}))

function getConnection() {
    return pool
}

//for uploading images we need multer requires
const storage = multer.diskStorage({
    destination: './upload/videos',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
})

router.get("/", (req, res) =>{
    const queryString = "SELECT * FROM videos"
    getConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            res.json({"error" : "server error"})
            return
        }
        const data = rows.map((row) => {
            return { "url" : row.video, "user_id" : row.user_id}
        })
        res.json({"data": data})
    })
})
    
    router.get("/:user_id", (req, res) =>{
        const userId = req.params.user_id
        const queryString = "SELECT * FROM videos WHERE user_id = ?"
        getConnection().query(queryString,[userId], (err, rows, fields) => {
            if (err) {
                res.json({"error" : "server error"})
                return
            }
            const users = rows.map((row) => {
                return { "url" : row.video, "user_id" : row.id}
            })
            res.json({"data" : users})
        })
    })
    
    
    router.post('/video_create', upload.single('video'),(req,res) => {
        console.log("Creating new video")
        
        const user_id = req.body.user_id
        console.log(req.body);
        const video = `http://${ip.address()}:3003/uploads/${req.file.filename}`
        const queryString  = "INSERT INTO videos (video, user_id) VALUES(?, ?)"
        getConnection().query(queryString, [video, user_id], (err, results, fields)=>{
        if (err) {
            res.json({"error" : err})
            return
        }
        
       res.json({"status" : true});
       res.end()
    })
    })
    
    module.exports = router
    
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'Family_DB'
    })