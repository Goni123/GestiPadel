const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const mongoose = require('mongoose');


const app = express();

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080

//log requests
app.use(morgan('tiny'));

//mongodb connection
const connectDB = async () => {
    try{
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true
        })

        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}
connectDB();

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

//set view engine
app.set("view engine", "ejs")  //pode ser html
//app.set("views",path.resolve(__dirname,"views/ejs"))

//load assets
app.use('/css', express.static(path.resolve(__dirname,"assets/css")))
app.use('/img', express.static(path.resolve(__dirname,"assets/img")))
app.use('/js', express.static(path.resolve(__dirname,"assets/js")))
//app.use(express.static(path.join(__dirname, 'views')));

//load routes
app.get('/',(req,res)=>{
    res.render("index");
})

//ROTAS LOGIN
app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/login', (req,res) =>{
    let username = req.body.username;
    let password = req.body.password;

    console.log(username)
    console.log(password)

    if(username && password){

    }
})

//ROTAS REGISTO
app.get('/registo', (req,res) =>{
    res.render("registo");
})

app.post('/registo', (req,res) =>{
    let username = req.body.username;
    let password = req.body.password;

    console.log(username)

})

app.listen(PORT, ()=> {
    console.log('Server is running on http://localhost:3000')
});