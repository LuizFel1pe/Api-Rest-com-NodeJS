const { Router } = require('express');

const authController = require('./controllers/authController');

const routes = Router();

routes.post('/auth/register', authController.index);

module.exports = routes;