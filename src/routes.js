const { Router } = require('express');

const authController = require('./app/controllers/authController');
const authenticatedController = require('./app/controllers/autheticatedController');
const projectController = require('./app/controllers/projectController');
const recoverPasswordController = require('./app/controllers/recoverPasswordController');

const authMiddleware = require('./app/middlewares/auth');

const routes = Router();

routes
  .post('/auth/register', authController.auth)
  .post('/auth/authenticate', authenticatedController.autheticate)
  .post('/auth/forgot_password', recoverPasswordController.forgotMyPassword)
  .post('/auth/reset_password', recoverPasswordController.resetMyPassword)
  .get('/projects', authMiddleware, projectController.listProjects)
  .get('/projects/:projectId', authMiddleware, projectController.listProject)
  .post('/projects', authMiddleware, projectController.create)
  .put('/projects/:projectId', authMiddleware, projectController.update)
  .delete('/projects/:projectId', authMiddleware, projectController.delete);

module.exports = routes;