const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const fs = require('fs')
const path = require('path');
const mongoose = require('mongoose');
const { create, db } = require('./model/usermodel');
const User = require('./model/usermodel')
const UserAdmin = require('./model/user_adminmodel')
const Tournament = require('./model/tournamentmodel')
const { now } = require("mongoose");
const {Pair} = require('./model/pairmodel')
var upload = require('./multerConfig')

var app = express();
require('dotenv/config');

//

//
//set up multer for storing uploaded files


const imgModel = require('./model/tournamentmodel');




app.use(cookieParser());
app.use(session({
    secret: "gestipadel",
    saveUninitialized: true,
    resave: true
}));


app.get('/', (req, res) => {
    res.render("index");
})

app.get('/inscricoes', (req, res) => {
    res.render("usersinsc");
})
app.get('/editar_torneio_menu', (req, res) => {
    res.render("menu_editar_torneio");
})

app.get('/eliminatorias', (req, res) => {
    res.render("brackets");
})

app.get('/home', (req, res) => {
    res.render("home_user");
    console.log(req.session.user)
})

app.get('/admin', (req, res) => {
    res.render("home_admin");
    console.log(req.session.user)
})

dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

//log requests
app.use(morgan('tiny'));

//mongodb connection
const connectDB = async () => {
    try {
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true
        })

        console.log(`MongoDB connected : ${con.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();

//parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

//set view engine
app.set("view engine", "ejs")  //pode ser html
//app.set("views",path.resolve(__dirname,"views/ejs"))

//load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
//app.use(express.static(path.join(__dirname, 'views')));

//load routes


app.get('/', (req, res) => {
    res.render("index");
})



app.get('/TorneiosAdmin', function (req, res) {
    Tournament.find({}).exec(function (err, docs) {
        res.render('Torneios_admin', { Tournament: docs })
    })
})
//ROTAS LOGIN
app.get('/login', (req, res) => {

    console.log(req.session.user)
    res.render("login")
})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log(username)
    console.log(password)

    UserAdmin.exists({ username: username, password: password }, function (err, doc) {
        if (err) {
            console.log(err)
        } else {
            if (doc) {
                console.log("O Login foi realizado com sucesso.")
                const user = {
                    username: username,
                    password: password
                }
                req.session.user = user;
                req.session.save();
                console.log(req.session.user)

                res.redirect('/admin');
            }
            else {
                console.log("Os dados introduzidos não estão corretos.")
            }

        }
    });
})

//ROTAS REGIS
app.get('/registo', (req, res) => {
    res.render("registo");
})

app.post('/registo', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let nif = req.body.nif;
    let contacto = req.body.contacto;
    let password = req.body.password;
    let password2 = req.body.confirmpassword;

    if (password == password2) {
        User.exists({ username: username, email: email, nif: nif, contacto: contacto }, function (err, doc) {
            if (err) {
                console.log(err)
            } else {
                if (doc) {
                    console.log("O dados que escolheu estão incorretos.")
                }
                else {
                    var new_user = new User({
                        "name": username,
                        "email": email,
                        "nif": nif,
                        "phone": contacto,
                        "password": password
                    })

                    new_user.save(function (err, doc) {
                        console.log(err)
                    });

                    res.redirect('home_user')
                }

            }
        });
    }
    else {
        console.log("As passwords não são idênticas.")
    }
})


app.get('/registo_admin', (req, res) => {
    res.render("registo_admin");
})

app.post('/registo_admin', (req, res) => {
    let username = req.body.username_admin;
    let password = req.body.password_admin;
    let password2 = req.body.confirmpassword_admin;

    if (password === password2) {

        UserAdmin.exists({ username: username }, function (err, doc) {
            if (err) {
                console.log(err)
            } else {
                if (doc) {
                    console.log("O username que escolheu já existe.")
                }
                else {
                    var new_user_admin = new UserAdmin({
                        "username": username,
                        "password": password
                    })

                    new_user_admin.save(function (err, doc) {
                        console.log(err)
                    });

                    res.redirect('home_admin')
                }

            }
        });
    }
    else {
        console.log("As passwords não são idênticas.")
    }

})




//ROTAS CRIAR TORNEIO
app.get('/criartorneio', (req, res) => {
    res.render("criar_torneio");

    /*imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('criar_torneio', { items: items });
        }
    })*/
})

app.post('/criartorneio', upload.single('img'), function (req, res) {
    var new_tournament = new Tournament({
        nometorneio: req.body.nometorneio,
        localizacao: req.body.localizacao,
        datainicio: req.body.datainicio,
        datafim: req.body.datafim,
        nparticipantes: req.body.nparticipantes,
        preco: req.body.preco,
        niveltipo: req.body.niveltipo,
        fasegrupos: req.body.fasegrupos,
        img: req.file.filename,
})


    new_tournament.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/admin')
        }
    })
})









//ROTAS INSCRIÇÃO TORNEIO
app.get('/insctorneio', (req, res) => {
    res.render("inscricao_torneio");
})

app.post('/inscricoes', async (req, res) => {
    let torneio = req.body.torneio;
    // let listaespera = req.body.listaespera;
    // let disponibilidade= req.body.disponibilidade;
    let nome1 = req.body.nomeum;
    let nome2 = req.body.nomedois;
    let level = req.body.playerlevel;
    let nif1 = req.body.nifum;
    let nif2 = req.body.nifdois;
    let email1 = req.body.emailum;
    let email2 = req.body.emaildois;
    let tel1 = req.body.telum;
    let tel2 = req.body.teldois;


    let dbuser1 = await User.where("nif").equals(nif1).exec()
    let dbuser2 = await User.where("nif").equals(nif2).exec()
    console.log(dbuser1)
    console.log(dbuser2)
// caso um dos users nao existir, adicionar á tabela de user
    if(dbuser1.length===0){
        dbuser1= await new User(
            {
                "name"  : nome1,
                "email" : email1,
                "phone" : tel1,
                "nif"   : nif1
            }).save()
        dbuser1 = await User.where("nif").equals(nif1).exec()
    }
    if(dbuser2.length===0){
        dbuser2= await new User(
            {
                "name"  : nome2,
                "email" : email2,
                "phone" : tel2,
                "nif"   : nif2
            }).save()
        dbuser2 = await User.where("nif").equals(nif2).exec()
    }

//caso ambos os users existem
    const pair = await Pair.find({users : { "$in":  [ dbuser1[0]._id , dbuser2[0]._id ]}})
    //const pair2 =
    if (pair.size === 0 ){ //this means they have no active pair
        let new_pair= new Pair({
            "users": [ dbuser1[0]._id , dbuser2[0]._id],
            "tournaments": [ {"id": "6388a37e9f6259e39e9c66dc"}],
        })
        await new_pair.save()//*/
    }else if (pair[0].tournaments.some(element => {return element.id === "6388a37e9f6259e39e9c66dc";})){ //caso os users ja tenham um par em conjunto
        console.log("dentro")
        //pair.tournaments.push({"id":   "6388a30d9f6259e39e9c66da"})
        await Pair.updateOne({_id: pair[0]._id },{$addToSet:{tournaments:{"id":   "6388a30d9f6259e39e9c66da"}}})

    }else{
        res.status(409)/*.send({
            message: 'Este par ja se encontra incrito neste torneio'
        })*/;
    }

})

app.get('/brackets', (req, res) => {
    res.render("brackets");
})

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000')
});