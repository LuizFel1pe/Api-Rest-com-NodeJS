const User = require('../models/User');

module.exports = {
  async index(request, response) {
    const { name, email, password } = request.body;

    try {
      const userAlreadyExists = await User.findOne({ email });

      if(userAlreadyExists) 
        return response.status(400).json({ error: 'User already exists '});

      const user = await User.create({ name, email, password });

      user.password = undefined;
      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: 'Registration error!' });
    };
  }
};