const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/naya-studio')

app.post('/api/signup', async (req, res) => {
    console.log(req.body)
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

app.get('/api/Canvas', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'ioIUj76KJ@hvu6')

        const email = decoded.email
        const user = await User.findOne({email : email})

        return{ status: 'ok'}
    } catch (error){
        console.log(error)
        res.json({status: 'error', error: 'invalid token'})
    } 
})


app.listen(1337, ()=> {
    console.log('Server started on 1337!!!')
})