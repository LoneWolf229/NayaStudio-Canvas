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
            brushColor: req.body.brushColor
        })
        res.json({status : 'ok', from:'signup'})
    } catch (error) {
        console.log(error)
        res.json({ status : 'error', error: 'Duplicate email', from:'signup' })
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

        return res.json({ 
            status: 'ok', user: token,
            firstname:user.firstname, 
            lastname:user.lastname, 
            email:user.email,
            brushcolor:user.brushcolor,
            from:'login'})
    } else {
        return res.json({status: 'ok', user: false, from:'login'})
    }
})


//Get request from Canvas.js ------ response - user detail
app.get('/api/auth', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'ioIUj76KJ@hvu6')
        const email = decoded.email
        const user = await User.findOne({email : email})
        let sketchcount = -1;
        let k = await Sketch.count({}, function(err, count){
            sketchcount=count
        });

        if(sketchcount === -1){
        await Sketch.count({}, function(err, count){
            sketchcount=count
        });
        }
        if(sketchcount === -1){
        await Sketch.count({}, function(err, count){
        sketchcount=count
        });}

        res.json({ status: 'ok', totalsketchcount: parseInt(sketchcount), from:'auth'})

        console.log('Sketch', sketchcount)
    } catch (error){
        console.log(error)
        res.json({status: 'error', error: 'invalid token',  from:'auth'})
    } 
})


//Post request to store sketch to DB
app.post('/api/savecanvas', async (req, res) => {

    if(req.body.sketchtype ==='new')
    {
        try{
            await Sketch.create({
                sketchstring: req.body.sketchstring,
                sketchname: req.body.sketchname,
            });
            let email = req.body.email
            await Sketch.updateOne(
                { sketchstring: req.body.sketchstring },
                { $addToSet: { userlist: email}  });
            res.json({status: 'ok', from:'savecanvas'})
            console.log('Saved')
        }catch (error) {
            console.log(error)
            res.json({ status : 'error', error: 'Unable to save to DB', from:'savecanvas' })
        }
    }else{
        let email = req.body.email
        await Sketch.findOneAndUpdate(
            {sketchname:req.body.sketchname},
            { $addToSet: { userlist: email} });
            res.json({status: 'ok', from:'savecanvas'})
    }

})

app.get('/api/panels', async (req, res) =>{
    try {
        var outgoing = []
        const cursor = Sketch.find().cursor()
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            outgoing.push(doc.sketchname)
          }
        res.json({status:'ok', names: outgoing, from:'panels'})
        } catch (error) {
            console.log(error)
            res.json({ status : 'error', error: 'Unable to save to DB' , from:'panels'})
        }
})

app.get('/api/userlist', async (req, res) =>{
    try {
        var outgoing = []

        let sketchname = req.sketchname

        let sketch = Sketch.findOne({sketchname : sketchname})

        let users = sketch.userlist

        res.json({status:'ok', names: users, from:'userlist'})
        } catch (error) {
            console.log(error)
            res.json({ status : 'error', error: 'Unable to save to DB' , from:'userlist'})
        }
})


app.listen(1337, ()=> {
    console.log('Server started on 1337!!!')
})