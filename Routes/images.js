const express = require('express')
const bodyParser = require("body-parser")
const router = express.Router() 
const mysql = require('mysql')
const multer = require("multer");
const path = require("path");
const ip = require("ip")

router.use(bodyParser.json({extended: false}))

function getConnection() {
    return pool
}

//for uploading images we need multer requires
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
})

router.get("/", (req, res) =>{
    const queryString = "SELECT * FROM images"
    getConnection().query(queryString, (err, rows, fields) => {
        if (err) {
            res.json({"error" : "server error"})
            return
        }
        const data = rows.map((row) => {
            return { "url" : row.image, "user_id" : row.user_id}
        })
        res.json({"data" : data})
    })})
    
    router.get("/:user_id", (req, res) =>{
        const userId = req.params.user_id
        const queryString = "SELECT * FROM images WHERE user_id = ?"
        getConnection().query(queryString,[userId], (err, rows, fields) => {
            if (err) {
                res.json({"error" : "server error"})
                return
            }
            const users = rows.map((row) => {
                return { "url" : row.image, "user_id" : row.user_id}
            })
            res.json({"data" : users})
        })
    })
    
    
    router.post('/images_create', upload.single('image'),(req,res) => {
        console.log("Creating new images")
        
        const user_id = req.body.user_id
        console.log(req.body);
        const image = `http://${ip.address()}:${process.env.PORT || 21823}/uploads/${req.file.filename}`
        const queryString  = "INSERT INTO images (user_id, image) VALUES(?, ?)"
        getConnection().query(queryString, [user_id, image], (err, results, fields)=>{
        if (err) {
            res.sendStatus(err)
            return
        }
        
       res.json({"status" : true});
       res.end()
    })
    })
    
    module.exports = router
    
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'mysql-21823-0.cloudclusters.net',
        user: 'anil',
        port: process.env.PORT || 21823,
        password: 'qwerty78',
        database: 'Family_DB'   
    })