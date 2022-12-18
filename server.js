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
const Pair = require('./model/pairmodel')
const { now } = require("mongoose");
var upload = require('./multerConfig')
const url = require('url');
var app = express();
require('dotenv/config');

//
//set up multer for storing uploaded files
const imgModel = require('./model/tournamentmodel');
const { array } = require('./multerConfig');

app.use(cookieParser());
app.use(session({
    secret: "gestipadel",
    saveUninitialized: true,
    resave: true
}));

app.get('/', (req, res) => {
    User.find({}).exec(function (err, docs) {
        res.render('alterar_inscricoes', { User: docs })
    })
})

/*app.get('/alterar_inscricoes/:id_torneio', async (req,res) =>{
    Tournament.find({}).exec(function (err, docs) {
        res.render('menu_editar_torneio', { Tournament: docs })
    })
})*/

app.post('/alterar_inscricoes/:id_torneio', async (req, res) => {
    /*Pair.find({tournaments:{$elemMatch:{_id:req.params.id_torneio}}}).exec(function(err,docs){
        res.render('alterar_inscricoes', {Pair : docs})
        console.log(docs)
    })*/

    let id_url = req.params.id_torneio
    console.log("O id é: " + id_url)

    var array_ids = []

    await Pair.find({ tournaments: { $elemMatch: { id: id_url } } }).exec(function (err, docs) {
        //res.render('alterar_inscricoes', {Pair : docs}, {id_url : req.params.id_torneio})
        console.log("ficheiro:" + docs)

        //var json = JSON.stringify(docs)
        for (var i = 0; i < docs.length; i++) {
            for (var j = 0; j < docs[i].users.length; j++) {
                var string = docs[i].users[j].toString()
                array_ids.push(string)
            }
        }
        console.log(array_ids)

    })

    /*for(var l=0; l< array_ids.length; l++){
        await User.find({_id : array_ids[l]}).exec(function (err, docs) {
            console.log(docs)
            res.render('alterar_inscricoes', { User: docs })
        })
    }*/

    await User.find({ _id: { $in: ['6391e50313339dd8ef8a38ff', '6391e54213339dd8ef8a3902', '6391e57b13339dd8ef8a3905', '6391e6f513339dd8ef8a3908', '6391e71313339dd8ef8a390b', '6391e74713339dd8ef8a390e'] } }).exec(function (err, docs) {
        if (docs) {
            console.log(docs)
        }
        res.render('alterar_inscricoes', { User: docs })
    })
})

app.get('/inscricoes/:id_torneio', (req, res) => {
    res.render("usersinsc");
})

app.get('/editar_torneio_menu', async (req, res) => {

})






app.post('/editar_torneio_menu/:id_torneio', async (req, res) => {
    //console.log(req.body)
    //console.log(inscOPEN) 
    let torneioID = req.params.id_torneio;
    let insc = await Tournament.findOne({ _id: torneioID }).exec()

    console.log(insc.has_ended)
    if (insc.has_ended === true) {
        res.render("editar_torneio_admin_1", { torneioID: req.params.id_torneio });
    }
    else if (insc.has_ended === false) {
        res.render("editar_torneio_admin", { torneioID: req.params.id_torneio });
    }

    Tournament.find({ _id: req.params.id_torneio }).exec(function (err, docs) {
        res.render("editar_torneio_admin", { Tournament: docs })
    })
    //res.render("editar_torneio_admin", {torneioID: req.params.id_torneio} );         
})

app.post('/editartorneiomenu/:id_torneio', async (req, res) => {
    let torneioID = req.params.id_torneio;
    Tournament.findOneAndUpdate({ _id: torneioID }, { has_ended: false }, { new: true }, (error, data) => {
        if (error) {
            console.log(error)
        }
    })

    res.render("editar_torneio_admin", { torneioID: req.params.id_torneio });

})

app.post('/editartorneio_menu/:id_torneio', async (req, res) => {
    let torneioID = req.params.id_torneio;
    Tournament.findOneAndUpdate({ _id: torneioID }, { has_ended: true }, { new: true }, (error, data) => {
        if (error) {
            console.log(error)
        }
    })

    res.render("editar_torneio_admin_1", { torneioID: req.params.id_torneio });

})


app.get('/home', (req, res) => {
    res.render("home_user");
    console.log(req.session.user)
})

app.get('/admin', (req, res) => {
    res.render("home_admin");
    console.log(req.session.user)
})

app.get('/brackets', (req, res) => {
    res.render("tournament_brackets");
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
//app.use(express.urlenconded({extended:false}))
app.use(express.json())
//app.use(express.static(path.join(__dirname, 'views')));

//load routes
app.get('/', (req, res) => {
    res.render("index");
})

app.post('/TorneiosAdmin', function (req, res) {
    Tournament.find({}).exec(function (err, docs) {
        res.render('Torneios_admin', { Tournament: docs })
    })
})

app.get('/TorneiosAdmin', function (req, res) {
    Tournament.find({}).exec(function (err, docs) {
        res.render('Torneios_admin', { Tournament: docs })
    })
})

app.post('/ProxTorneios', function (req, res) {
    Tournament.find({ has_ended: false }).exec(function (err, docs) {
        res.render('Torneios_User_Prox', { Tournament: docs })
    })
})

app.get('/ProxTorneios', function (req, res) {
    Tournament.find({ has_ended: false }).exec(function (err, docs) {
        res.render('Torneios_User_Prox', { Tournament: docs })
    })
})

app.get('/TorneiosAndamento', function (req, res) {
    Tournament.find({ has_ended: true }).exec(function (err, docs) {
        res.render('Torneios_User_Anda', { Tournament: docs })
    })
})

app.post('/TorneiosAndamento', function (req, res) {
    Tournament.find({ has_ended: true }).exec(function (err, docs) {
        res.render('Torneios_User_Anda', { Tournament: docs })
    })
})

app.post('/alterar_inscricoes/:id_torneio', (req, res) => {
    res.render("alterar_inscricoes");
})

app.get('/apagar_inscricao', (req, res) => {
    console.log("bruno é gay")
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

                    res.redirect('home')
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
        inscricoes: req.body.insc
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
app.get('/insctorneio/:id_torneio', (req, res) => {
    Tournament.find({ _id: req.params.id_torneio }).exec(function (err, docs) {
        res.render('usersinsc', { Tournament: docs })
    })
})

app.post('/insctorneio/:id_torneio', async (req, res) => {
    let torneio = req.body.torneio;
    // let listaespera = req.body.listaespera;
    // let disponibilidade= req.body.disponibilidade;
    let nome1 = req.body.nameum;
    let nome2 = req.body.namedois;
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
    if (dbuser1.length === 0) {
        dbuser1 = await new User(
            {
                "name": nome1,
                "email": email1,
                "phone": tel1,
                "nif": nif1
            }).save()
        dbuser1 = await User.where("nif").equals(nif1).exec()
    }
    if (dbuser2.length === 0) {
        dbuser2 = await new User(
            {
                "name": nome2,
                "email": email2,
                "phone": tel2,
                "nif": nif2
            }).save()
        dbuser2 = await User.where("nif").equals(nif2).exec()
    }

    //caso ambos os users existem
    //const pair = await Pair.find({ users: { "$in": [dbuser1[0]._id, dbuser2[0]._id] } })
    //const pair2 =
    //console.log(pair);
    //if (pair.size === 0) { //this means they have no active pair
    let new_pair = new Pair({
        "users": [dbuser1[0]._id, dbuser2[0]._id],
        "tournaments": [{ "id": req.params.id_torneio }],
    })
    console.log("here")
    await new_pair.save();//*/
   /* }else if (pair[0].tournaments.some(element => { return element.id === req.params.id_torneio; })) { //caso os users ja tenham um par em conjunto
        console.log("dentro")
        //pair.tournaments.push({"id":   "6388a30d9f6259e39e9c66da"})
        await Pair.updateOne({ _id: pair[0]._id }, { $addToSet: { tournaments: { "id": req.params.id_torneio } } })

    } else {
        res.status(409)/*.send({
            message: 'Este par ja se encontra incrito neste torneio'
        })*/;

    //}
    res.redirect('/home');

})

app.get('/brackets', (req, res) => {
    res.render("brackets");
})

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000')
});
