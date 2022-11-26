const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const mongoose = require('mongoose');
const { create } = require('./model/usermodel');
const User = require('./model/usermodel')
var UserAdmin = require('./model/user_adminmodel')

const app = express();

app.get('/',(req,res)=>{
    res.render("index");
})

app.get('/inscricoes',(req,res)=>{
    res.render("usersinsc");
})

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

    UserAdmin.exists({username:username, password:password}, function (err, doc) {
        if (err){
            console.log(err)
        }else{
            if(doc){
                console.log("O Login foi realizado com sucesso.")
            }
            else{
                console.log("Os dados introduzidos não estão corretos.")
            }

        }
    });
})

//ROTAS REGISTO
app.get('/registo', (req,res) =>{
    res.render("registo");
})

app.post('/registo', (req,res) =>{
    let username = req.body.username;
    let email = req.body.email;
    let nif = req.body.nif;
    let contacto = req.body.contacto;
    let password = req.body.password;
    let password2 = req.body.confirmpassword;

    if(password == password2){
        User.exists({username:username,email: email, nif:nif, contacto:contacto}, function (err, doc) {
            if (err){
                console.log(err)
            }else{
                if(doc){
                    console.log("O dados que escolheu estão incorretos.")
                }
                else{
                    var new_user = new User({
                        "username": username,
                        "email": email,
                        "nif": nif,
                        "contacto": contacto,
                        "password":password
                    })
    
                    new_user.save(function (err, doc) {
                        console.log(err)
                    });
                }
    
            }
        });
    }
    else{
        console.log("As passwords não são idênticas.")
    }
})


app.get('/registo_admin', (req,res) =>{
    res.render("registo_admin");
})

app.post('/registo_admin', (req,res) =>{
    let username = req.body.username_admin;
    let password = req.body.password_admin;
    let password2 = req.body.confirmpassword_admin;
 
    if(password == password2){

        UserAdmin.exists({username:username}, function (err, doc) {
            if (err){
                console.log(err)
            }else{
                if(doc){
                    console.log("O username que escolheu já existe.")
                }
                else{
                    var new_user_admin = new UserAdmin({
                        "username": username,
                        "password":password
                    })
    
                    new_user_admin.save(function (err, doc) {
                        console.log(err)
                    });
                }
    
            }
        });
    }
    else{
        console.log("As passwords não são idênticas.")
    }

})

//ROTAS CRIAR TORNEIO
app.get('/criartorneio', (req,res) =>{
    res.render("criar_torneio");
})

app.post('/criartorneio', (req,res) =>{
    let nometorneio = req.body.nometorneio;
    let datainicio = req.body.datainicio;
    let datafim= req.body.datafim;
    let numeroparticipantes = req.body.numeroparticipantes;
    let tipo = req.body.tipo;
    let formato = req.body.formato;
    let img = req.body.img;

        var tournamentSchema = new mongoose.Schema({
            username:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true,
            }
        })

        var UserAdmin = mongoose.model('user_admins',useradminSchema)
        var new_user_admin = new UserAdmin({
            "username": username,
            "password":password
        })

        new_user_admin.save(function (err, doc) {
            console.log(doc._id);
        });

    })


//ROTAS INSCRIÇÃO TORNEIO
app.get('/insctorneio', (req,res) =>{
    res.render("inscricao_torneio");
})

app.post('/insctorneio', (req,res) =>{
    let torneio = req.body.torneio;
    let listaespera = req.body.listaespera;
    let disponibilidade= req.body.disponibilidade;
    let fnome = req.body.fnome;
    let lname = req.body.lname;
    let playerlevel = req.body.playerlevel;
    let nif = req.body.nif;
    let email = req.body.email;
    let tel = req.body.tel;

    console.log(torneio)
    console.log(listaespera)
    console.log(disponibilidade)
    console.log(fnome)
    console.log(lnome)
    console.log(playerlevel)
    console.log(nif)
    console.log(email)
    console.log(tel)

})

app.listen(PORT, ()=> {
    console.log('Server is running on http://localhost:3000')
});