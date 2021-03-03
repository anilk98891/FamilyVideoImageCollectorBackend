const http = require('http');
const app = require('./app');
const mysql = require('mysql')
const server = http.createServer(app);

const PORT = process.env.PORT || 21823;

const pool = mysql.createConnection({
    connectionLimit: 10,
    host: 'mysql-21823-0.cloudclusters.net',
    user: 'anil',
    port: process.env.PORT || 21823,
    password: 'qwerty78',
    database: 'Family_DB'   
})

pool.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

server.listen(PORT,() => {
    console.log("Listening :" + PORT)
})