const express = require('express')
const app = express()

const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/naya-studio')

app.post('/api/signup', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.create({
            name: req.body.name,
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
        return res.json({ status: 'ok', user: true})
    } else {
        return res.json({status: 'ok', user: false})
    }
})


app.listen(1337, ()=> {
    console.log('Server started on 1337!!!')
})