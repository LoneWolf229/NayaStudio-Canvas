const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const User = require('./models/user.model')
const Sketch = require("./models/sketch.model")

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/naya-studio')


//API to handle sign up usecase
app.post('/api/signup', async (req, res) => {
    try {
        const user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
        })
        res.json({status : 'ok'})
    } catch (error) {
        console.log(error)
        res.json({ status : 'error', error: 'Duplicate email' })
    }
})

//API to handle Login usecase
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if (user) {

        const token = jwt.sign({
            firstname: user.firstname,
            email: user.email,
        }, 'ioIUj76KJ@hvu6')

        return res.json({ status: 'ok', user: token})
    } else {
        return res.json({status: 'ok', user: false})
    }
})


//Get request from Canvas.js ------ response - user detail
app.get('/api/canvas', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'ioIUj76KJ@hvu6')
        const email = decoded.email
        const user = await User.findOne({email : email})
        
        const query = await Sketch.count();

        res.json({ status: 'ok', firstname: user.firstname, lastname: user.lastname, email: user.email, totalsketchcount: query})
    } catch (error){
        console.log(error)
        res.json({status: 'error', error: 'invalid token'})
    } 
})


//Post request to store sketch to DB
app.post('/api/savecanvas', async (req, res) => {
    try{
        const sketch = Sketch.create({
            sketchstring: req.body.sketchstring,
            sketchname: req.body.sketchname,
        });
        res.json({status: 'ok'})
    }catch (error) {
        console.log(error)
        res.json({ status : 'error', error: 'Unable to save to DB' })
    }

})

app.get('/api/panels', async (req, res) =>{
    try {
        var outgoing = []
        const cursor = Sketch.find().cursor()
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            outgoing.push(doc.sketchname)
          }
          console.log(outgoing)
        res.json({status:'ok', names: outgoing})
        } catch (error) {
            console.log(error)
            res.json({ status : 'error', error: 'Unable to save to DB' })
        }
})


app.listen(1337, ()=> {
    console.log('Server started on 1337!!!')
})