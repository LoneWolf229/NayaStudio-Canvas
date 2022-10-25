const mongoose = require('mongoose')

const sketch = new mongoose.Schema({
    sketchstring: {type:String, required: true, default: ""},
    sketchname: {type:String, required: true, unique: true},
    userlist: [{ type:String}]
})

const model = mongoose.model('SketchData', sketch)

module.exports = model