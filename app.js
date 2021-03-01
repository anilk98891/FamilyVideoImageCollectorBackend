const express = require('express')
const app = express()
const morgan = require('morgan')
const router = express.Router() 

app.use(morgan('short'))
app.use(router)

const userRoutes = require('./Routes/users.js')
const userImagesRoutes = require('./Routes/images.js')
const userVideosRoutes = require('./Routes/videos.js')

app.use('/users', userRoutes);
app.use('/image', userImagesRoutes);
app.use('/video', userVideosRoutes);
app.use('/uploads',express.static('upload/images')); // this for not shown the directory to user https://expressjs.com/en/starter/static-files.html
//or app.use(express.static('upload')); //directly use images
app.use('/uploads',express.static('upload/videos'));

app.listen(3003, () => {
    console.log("server is up and listening 3003..")
})
module.exports = app;