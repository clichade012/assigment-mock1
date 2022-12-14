const express = require('express');
const mongoose = require('mongoose')
const route = require('./routes/route');
const app = express()

app.use(express.json())


mongoose.connect("mongodb+srv://raj_3028:kWaM507ps0Icsdg0@cluster0.pw23ckf.mongodb.net/tailwebschaitanyalichade-DB?retryWrites=true&w=majority",{
    useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected on 27017"))
.catch(err => console.log(err))


app.use('/', route);



app.listen( 3000, function () {
    console.log('Express app running on port ' + (3000))
}) 