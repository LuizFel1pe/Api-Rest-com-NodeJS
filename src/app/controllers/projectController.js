const Project = require('../models/Project');
const Task = require('../models/Task');

module.exports = {
  async list(request, response) {
    try {
      const projects = await Project.find();

      return response.json(projects);
    } catch (err) {
      return response.status(400).json({ error: 'Error loading projects '});
    }
  },

  async create(request, response) {
    try {
      const project = await Project.create({ 
        ...request.body, 
        user: request.userId
       });

      return response.json(project)

    } catch (err) {
      return response.status(400).json({ error: 'Error creating new project' });
    }
  },

  async update(request, response) {

  },

  async delete(request, response) {

  }
};