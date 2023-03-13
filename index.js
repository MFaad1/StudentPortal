const express = require('express')
const {connect} = require('./App/helper/dbdata')
const router = require('./App/Routes/routes')
const cors = require('cors')
const app = express()
const port = 3300;
app.use(express.json())

app.use(cors())
app.use('/auth', router)


connect()

app.listen(port, ()=>{
    console.log("Connect to " + port)
})
