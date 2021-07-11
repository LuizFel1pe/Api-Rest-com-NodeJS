const { Router } = require('express');

const authController = require('./controllers/authController');
const authenticatedController = require('./controllers/autheticatedController');
const projectController = require('./controllers/projectController');

const authMiddleware = require('./middlewares/auth');

const routes = Router();

routes
  .post('/auth/register', authController.auth)
  .post('/authenticate', authenticatedController.autheticate)
  .get('/projects', authMiddleware, projectController.list);

module.exports = routes;