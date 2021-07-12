const { update } = require('../models/Project');
const Project = require('../models/Project');
const Task = require('../models/Task');

module.exports = {
  async listProjects(request, response) {
    try {
      const projects = await Project.find().populate(['user', 'tasks']);

      return response.json(projects);
    } catch (err) {
      return response.status(400).json({ error: 'Error loading projects '});
    }
  },

  async listProject(request, response) {
    const { projectId } = request.params;
    try {
      const project = await Project.findById(projectId).populate(['user', 'tasks']);

      return response.json(project);
    } catch (err) {
      return response.status(400).json({ error: 'Error loading projects '});
    }
  },

  async create(request, response) {
    try {
      const { title, description, tasks } = request.body;
      
      const project = await Project.create({ 
        title,
        description, 
        user: request.userId
       });

      await Promise.all(tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      }));

      await project.save();

      return response.json(project)

    } catch (err) {
      return response.status(400).json({ error: 'Error creating new project' });
    }
  },

  async update(request, response) {
    try {
      const { projectId } = request.params;
      const { title, description, tasks } = request.body;
      
      const project = await Project.findByIdAndUpdate(projectId, { 
        title,
        description
       }, { new: true });

      projects.tasks = [];
      await Task.remove({ project: project._id });

      await Promise.all(tasks.map(async task => {
        const projectTask = new Task({ ...task, project: project._id });

        await projectTask.save();

        project.tasks.push(projectTask);
      }));

      await project.save();

      return response.json(project)

    } catch (err) {
      return response.status(400).json({ error: 'Error updating project' });
    }
  },

  async delete(request, response) {
    const { projectId } = request.params;
    try {
      const project = await Project.findByIdAndRemove(projectId);

      return response.status(204).send();
    } catch (err) {
      return response.status(400).json({ error: 'Error deleting project '});
    }
  }
};