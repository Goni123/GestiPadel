const express = require('express');
const route = express.Router()
const services = require('../services/render');
const controller = require("../controller/controller")

route.get('/',services.homeRoutes);

route.get('/adicionar-utilizador', services.add_user)

route.get('/atualizar-utilizador',services.update_user)

//API
route.post('/api/users', controller.create)
route.get('/api/users', controller.find)
route.put('/api/users/:id', controller.update)
route.delete('/api/users/:id', controller.delete)

module.exports = route

