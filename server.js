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
const Game = require('./model/jogomodel')
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
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //one day wait
    resave: false
}));

app.get('/', (req, res) => {
    res.render("home_user", { US: req.session.user });
    console.log(req.session.user)
})

app.get('/inscricoes/:id_torneio', async (req, res) => {
    let T = await Tournament.findOne({ _id: req.params.id_torneio }).exec()
    res.render("usersinsc", { Tor: T, US: req.session.user });
/*app.get('/alterar_inscricoes/:id_torneio', async (req,res) =>{
    Tournament.find({}).exec(function (err, docs) {
        res.render('menu_editar_torneio', { Tournament: docs })
    })
})*/})


app.get('/alterar_inscricoes/:id_torneio', async (req, res) => {
    let array_ids = []
    let docs = await Pair.find({ tournaments: { $elemMatch: { id: mongoose.Types.ObjectId(req.params.id_torneio) } } }).exec()
    let converted = JSON.parse(JSON.stringify(docs))
    console.log(converted)
    for (i of converted) {
        for (j of i.users) {
            array_ids.push(j)
        }
    }
    let users = await User.find({ _id: { $in: array_ids } }).exec()
    res.render('alterar_inscricoes', { User: users, Array: array_ids, US: req.session.user, Pairs: converted, torneio: req.params.id_torneio })

})

app.post('/alterar_inscricoes/:id_torneio', async (req, res) => {

    let array_ids = []
    let docs = await Pair.find({ tournaments: { $elemMatch: { id: mongoose.Types.ObjectId(req.params.id_torneio) } } }).exec()
    let converted = JSON.parse(JSON.stringify(docs))
    console.log(converted)
    for (i of converted) {
        for (j of i.users) {
            array_ids.push(j)
        }
    }
    let users = await User.find({ _id: { $in: array_ids } }).exec()
    res.render('alterar_inscricoes', { User: users, Array: array_ids, US: req.session.user, Pairs: converted, torneio: req.params.id_torneio })
})

app.get('/inscricoes/:id_torneio', (req, res) => {
    res.render("usersinsc", { US: req.session.user });
})

app.get('/editar_torneio_menu', async (req, res) => {
    res.render("editar_torneio_admin", { US: req.session.user });
})


app.post('/editar_torneio_menu/:id_torneio', async (req, res) => {

    Tournament.find({ _id: req.params.id_torneio }).exec(function (err, docs) {
        res.render("editar_torneio_admin", { Tournament: docs, US: req.session.user })
    })

})

app.post('/torneiomenu/:id_torneio', async (req, res) => {

    let insc = await Tournament.findOne({ _id: tournment._id }).exec()
    //let insc = await Tournament.findOne({ _id: id_torneio }).exec()
    //inscri = insc.has_ended; 
    console.log(insc)
    if (insc.has_ended === false) {
        Tournament.findOneAndUpdate({ _id: req.params.id_torneio }, { has_ended: true }, { new: true }, (error, docs) => {
            if (error) {
                console.log(error)
            }
            else {
                Tournament.find({ _id: req.params.id_torneio }).exec(function (err, docs) {
                    res.render("editar_torneio_admin", { Tournament: docs, US: req.session.user })
                })
            }
        })
    }

    else if (insc.has_ended === true) {
        Tournament.findOneAndUpdate({ _id: req.params.id_torneio }, { has_ended: false }, { new: true }, (error, docs) => {
            if (error) {
                console.log(error)
            }
            else {
                Tournament.find({ _id: req.params.id_torneio }).exec(function (err, docs) {
                    res.render("editar_torneio_admin", { Tournament: docs, US: req.session.user })
                })
            }
        })
    }
})

app.get('/editar_brakets/:id_torneio', async (req, res) => {
    let array_ids = []
    // console.log(req.params.id_torneio)
    let docs = await Pair.find({ tournaments: { $elemMatch: { id: req.params.id_torneio } } }).exec()
    let converted = JSON.parse(JSON.stringify(docs))
    for (i of converted) {
        for (j of i.users) {
            array_ids.push(j)
        }
    }
    let users = await User.find({ _id: { $in: array_ids } }).exec()
    let tour = await Tournament.findOne({ _id: req.params.id_torneio }).exec()
    console.log(tour)
    //console.log(users)
    res.render("tournament_brackets", { Pares: docs, Utilizadores: users, US: req.session.user, Tor: tour });

})

app.post('/editar_brakets/:id_torneio', async (req, res) => {
    let array_ids = []
    // console.log(req.params.id_torneio)
    let docs = await Pair.find({ tournaments: { $elemMatch: { id: req.params.id_torneio } } }).exec()
    let converted = JSON.parse(JSON.stringify(docs))
    for (i of converted) {
        for (j of i.users) {
            array_ids.push(j)
        }
    }
    let users = await User.find({ _id: { $in: array_ids } }).exec()
    let tour = await Tournament.findOne({ _id: req.params.id_torneio }).exec()
    //console.log(array_ids)
    //console.log(users)
    res.render("tournament_brackets", { Pares: docs, Utilizadores: users, US: req.session.user, Tor: tour });

})


app.get('/home', (req, res) => {

    res.render("home_user", { US: req.session.user });
    console.log(req.session.user)
})

app.get('/admin', (req, res) => {
    res.render("home_admin", { US: req.session.user });
    console.log(req.session.user)
})
app.post('/admin', (req, res) => {
    res.render("home_admin", { US: req.session.user });
    console.log(req.session.user)
})

app.get('/brackets', async (req, res) => {
    //let pair=await Pair.find({ tournaments: { $elemMatch: { id: "6391c5456d93c66ed47b4c0a" } } }).populate('users').exec()
    //console.log(pair)
    let array_ids = []
    let value = ""
    let docs = await Pair.find({ tournaments: { $elemMatch: { id: "6391c5456d93c66ed47b4c0a" } } }).exec()
    let converted = JSON.parse(JSON.stringify(docs))
    for (i of converted) {
        for (j of i.users) {
            array_ids.push(j)
        }
    }
    let users = await User.find({ _id: { $in: array_ids } }).exec()
    console.log(array_ids)
    console.log(users)
    res.render("tournament_brackets", { Pares: docs, Utilizadores: users, US: req.session.user });
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

app.post('/TorneiosAdmin', function (req, res) {
    Tournament.find({}).exec(function (err, docs) {
        res.render('Torneios_admin', { Tournament: docs, US: req.session.user })
    })
})

app.get('/TorneiosAdmin', function (req, res) {
    Tournament.find({}).exec(function (err, docs) {
        res.render('Torneios_admin', { Tournament: docs, US: req.session.user })
    })
})

app.post('/ProxTorneios', function (req, res) {
    Tournament.find({ has_ended: false }).exec(function (err, docs) {
        res.render('Torneios_User_Prox', { Tournament: docs, US: req.session.user })
    })
})

app.get('/ProxTorneios', function (req, res) {
    Tournament.find({ has_ended: false }).exec(function (err, docs) {
        res.render('Torneios_User_Prox', { Tournament: docs, US: req.session.user })
    })
})

app.get('/TorneiosAndamento', function (req, res) {
    Tournament.find({ has_ended: true }).exec(function (err, docs) {
        res.render('Torneios_User_Anda', { Tournament: docs, US: req.session.user })
    })
})

app.post('/TorneiosAndamento', function (req, res) {
    Tournament.find({ has_ended: true }).exec(function (err, docs) {
        res.render('Torneios_User_Anda', { Tournament: docs, US: req.session.user })
    })
})

app.get('/apagar_inscricao/:id_torneio/:id_par', async (req, res) => {

    var id_par = req.params.id_par
    var id_torneio = req.params.id_torneio
    console.log("ID PAR::: " + id_par)
    console.log("ID TORNEIO::: " + id_torneio)

    Pair.updateOne({ _id: id_par }, { $pull: { tournaments: { id: req.params.id_torneio } } }).exec(async function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            let array_ids = []
            let docs = await Pair.find({ tournaments: { $elemMatch: { id: mongoose.Types.ObjectId(req.params.id_torneio) } } }).exec()
            let converted = JSON.parse(JSON.stringify(docs))

            for (i of converted) {
                for (j of i.users) {
                    array_ids.push(j)
                }
            }
            let users = await User.find({ _id: { $in: array_ids } }).exec()
            res.redirect('/alterar_inscricoes/' + req.params.id_torneio)
        }
    })

})

app.post('/editar_inscricao/:id_torneio/:id_utilizador1/:id_utilizador2', async (req, res) => {
    var nome_jogador1 = req.body.name1
    var email_jogador1 = req.body.email1
    var phone_jogador1 = req.body.phone1
    var nif_jogador1 = req.body.nif1

    var nome_jogador2 = req.body.name2
    var email_jogador2 = req.body.email2
    var phone_jogador2 = req.body.phone2
    var nif_jogador2 = req.body.nif2

    var id_utilizador1 = req.params.id_utilizador1
    var id_utilizador2 = req.params.id_utilizador2

    var torneio_id = req.params.id_torneio

    res.render('editar_inscricoes', { nome1: nome_jogador1, email1: email_jogador1, phone1: phone_jogador1, nif1: nif_jogador1, nome2: nome_jogador2, email2: email_jogador2, phone2: phone_jogador2, nif2: nif_jogador2, id_jogador1: id_utilizador1, id_jogador2: id_utilizador2, torneio_id: torneio_id, US: req.session.user })
})

app.post('/editar_inscricao/:id_torneio/:id_utilizador', async (req, res) => {

    var nome_jogador = req.body.username
    var email_jogador = req.body.email
    var phone_jogador = req.body.phone
    var nif_jogador = req.body.nif

    var id_utilizador = req.params.id_utilizador

    var id_torneio = req.params.id_torneio

    User.updateOne({ _id: id_utilizador }, { $set: { name: nome_jogador, email: email_jogador, phone: phone_jogador, nif: nif_jogador } }).exec(async function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {

            let array_ids = []
            let docs = await Pair.find({ tournaments: { $elemMatch: { id: mongoose.Types.ObjectId(id_torneio) } } }).exec()
            let converted = JSON.parse(JSON.stringify(docs))

            for (i of converted) {
                for (j of i.users) {
                    array_ids.push(j)
                }
            }
            let users = await User.find({ _id: { $in: array_ids } }).exec()
            res.redirect('/alterar_inscricoes/' + id_torneio)

        }
    })
})

//ROTAS LOGIN
app.get(['/login', '/login/error'], async (req, res) => {

    console.log(req.session.user)

    if (typeof req.session.user !== 'undefined') {
        if (req.session.user.type === 1) {
            res.redirect("/admin")
        } else if (req.session.user.type === 0) {
            res.redirect(("/home"))
        }
    } else {

        res.render("login", { US: req.session.user })
    }

})

app.post(['/login', '/login/error'], async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.path)
    console.log(username)
    console.log(password)

    /*UserAdmin.exists({ username: username, password: password }, function (err, doc) {
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
   });//*/
    let target = "/login"
    let adm = await UserAdmin.find({ username: username, password: password }).exec()
    let usr = await User.find({ name: username, password: password }).exec()
    if (adm.length === 1) {
        req.session.user = {

            username: adm[0].username,
            uid: adm[0]._id,
            type: 1,
        }
        res.redirect('/admin')
    }
    console.log(adm, usr)
    if (usr.length === 1) {
        req.session.user = {

            username: usr[0].name,
            uid: usr[0]._id,
            type: 0,
        }
        res.redirect('/home')
    }


})
//ROTAS LOGOUT
app.get('/logout', (req, res) => {
    delete req.session.user
    req.session.save();
    res.redirect('/home')
});

//ROTAS REGIS
app.get('/registo', (req, res) => {
    res.render("registo", { US: req.session.user });
})

app.post('/registo', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let nif = req.body.nif;
    let contacto = req.body.contacto;
    let password = req.body.password;
    let password2 = req.body.confirmpassword;

    if (password === password2) {
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
    res.render("registo_admin", { US: req.session.user });
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
                    let new_user_admin = new UserAdmin({
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
    res.render("criar_torneio", { US: req.session.user });
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
            res.render('home_admin', { US: req.session.user })
        }
    })
})

//ROTAS INSCRIÇÃO TORNEIO
app.get('/insctorneio/:id_torneio', async (req, res) => {
    let T = await Tournament.find({ _id: req.params.id_torneio }).exec()
    console.log(T, T[0].niveltipo)
    res.render('usersinsc', { Tournament: T, niveis: T[0].niveltipo, US: req.session.user })
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
    let avl = req.body.avail;
    let arravl = avl.split(',')
    arravl.pop()
    console.log(arravl)


    let dbuser1 = await User.where("nif").equals(nif1).exec()
    let dbuser2 = await User.where("nif").equals(nif2).exec()
    console.log(dbuser1)
    console.log(dbuser2)
    let flag = false
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
        flag = true
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
        flag = true
    }

    //caso ambos os users existem
    //const pair = await Pair.find({ users: { "$in": [dbuser1[0]._id, dbuser2[0]._id] } })
    //const pair2 =
    //console.log(pair);
    //if (pair.size === 0) { //this means they have no active pair
    if (!flag) {
        //!F
        const pair = await Pair.find({ users: { "$in": [dbuser1[0]._id, dbuser2[0]._id] } })
        if (pair[0].tournaments.some(element => { return element.id === req.params.id_torneio; })) { //caso os users ja tenham um par em conjunto
            //S
            await Pair.updateOne({ _id: pair[0]._id }, { $addToSet: { tournaments: { "id": req.params.id_torneio, "level": level, "unavailability": arravl } } })

        } else {
            //N
            let new_pair = new Pair({
                "users": [dbuser1[0]._id, dbuser2[0]._id],
                "tournaments": [{ "id": req.params.id_torneio, "level": level, "unavailability": arravl }],
            })
            console.log("here")
            await new_pair.save();
        }
    } else if (flag) {
        //F
        let new_pair = new Pair({
            "users": [dbuser1[0]._id, dbuser2[0]._id],
            "tournaments": [{ "id": req.params.id_torneio, "level": level, "unavailability": arravl }],
        })
        console.log("here")
        await new_pair.save();
    }
    //*/
    /* }else if (pair[0].tournaments.some(element => { return element.id === req.params.id_torneio; })) { //caso os users ja tenham um par em conjunto
         console.log("dentro")
         //pair.tournaments.push({"id":   "6388a30d9f6259e39e9c66da"})
         await Pair.updateOne({ _id: pair[0]._id }, { $addToSet: { tournaments: { "id": req.params.id_torneio } } })
 
     } else {
         res.status(409)/*.send({
             message: 'Este par ja se encontra incrito neste torneio'
         });
 
     //}*/
    res.redirect('/home');

})

/*app.get('/brackets', async (req, res) => {

    res.render("brackets");
    console.log("asd")
    let a = await Game.find({ tournament: ObjectId("6388a30d9f6259e39e9c66da") }).exec()
    console.log(a)


})*/

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000')
});

app.get('/calendario_jogos/:id_torneio', async (req, res) => {
    res.render("calendario_jogos", { US: req.session.user });
})

app.post(['/calendario_jogos/:id_torneio', '/calendario_jogos/:id_toneio/:nivel'], async (req, res) => {
    /*let id_url = req.params.id_torneio
    console.log("O id Ã©: " + id_url)

    var array_ids = []

    await Pair.find({ tournaments: { $elemMatch: { id: id_url } } }).exec(function (err, docs) {

        console.log("ficheiro:" + docs)

        for (var i = 0; i < docs.length; i++) {
            for (var j = 0; j < docs[i].users.length; j++) {
                var string = docs[i].users[j].toString()
                array_ids.push(string)
            }
        }
        console.log(array_ids)

    })

    await User.find({
        _id: {
            $in: ['6391e50313339dd8ef8a38ff',
                '63a02a937b76ea554aa6883d',
                '6391e57b13339dd8ef8a3905',
                '6391e6f513339dd8ef8a3908',
                '639dea08ce774fde3f188f11',
                '639dea08ce774fde3f188f14',
                '63a028ce3040672c93bdbe4c',
                '63a029063040672c93bdbe4f']
        }
    }).exec(function (err, docs) {
        if (docs) {
            console.log(docs)
        }*/

    let tor = await Tournament.find({ "_id": mongoose.Types.ObjectId(req.params.id_torneio) }).exec()

    console.log(typeof tor)

    let array_ids = []
    console.log(req.params.id_torneio)
    let docs = await Pair.find({ tournaments: { $elemMatch: { id: req.params.id_torneio } } }).exec()
    let converted = JSON.parse(JSON.stringify(docs))
    for (i of converted) {
        for (j of i.users) {
            array_ids.push(j)
        }
    }
    let users = await User.find({ _id: { $in: array_ids } }).exec()
    console.log(typeof tor[0])

    let jogos = await Game.find({tournament:req.params.id_torneio }).exec()
    let array_ids_pares = []
    let converted_jogos = JSON.parse(JSON.stringify(jogos))
    for(var i = 0; i< converted_jogos.length; i++){
        array_ids_pares.push({par1:converted_jogos[i].pair1, par2:converted_jogos[i].pair2})
    }
    console.log(array_ids_pares)

    let array = []

    for(var j =0; j< array_ids_pares.length; j++){
        let par1 = await Pair.find({_id:array_ids_pares[j].par1}).exec()
        let par2 = await Pair.find({_id:array_ids_pares[j].par2}).exec()
        let converted_par1 = JSON.parse(JSON.stringify(par1))
        let converted_par2 = JSON.parse(JSON.stringify(par2))
  
        array.push({dupla1:converted_par1[0].users,dupla2:converted_par2[0].users})
    }

    console.log(array)

    array_user=[]
    
   for(var k=0; k< array.length; k++){
        let par1_user1 = await User.find({_id:array[k].dupla1[0]}).exec()
        let par1_user2 = await User.find({_id:array[k].dupla1[1]}).exec()
        let par2_user1 = await User.find({_id:array[k].dupla2[0]}).exec()
        let par2_user2 = await User.find({_id:array[k].dupla2[1]}).exec()
        let converted_par1_user1 = JSON.parse(JSON.stringify(par1_user1))
        let converted_par1_user2 = JSON.parse(JSON.stringify(par1_user2))
        let converted_par2_user1 = JSON.parse(JSON.stringify(par2_user1))
        let converted_par2_user2 = JSON.parse(JSON.stringify(par2_user2))

        console.log(converted_par1_user1)
        console.log(converted_par1_user2)
        console.log(converted_par2_user1)
        console.log(converted_par2_user2)

        array_user.push({jogo_dupla1:[converted_par1_user1[0].name,converted_par1_user2[0].name], jogo_dupla2: [converted_par2_user1[0].name,converted_par2_user2[0].name]}) 
   }

   console.log(array_user)

    res.render('calendario_jogos', {Jogos: array_user, Pares: docs, Utilizadores: users, Torneio: tor[0], US: req.session.user })

})