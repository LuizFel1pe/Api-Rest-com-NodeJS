const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const authConfig = require('./config/auth.json');

const routes = Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

routes.post('/auth/register', async (request, response) => {
  const { name, email, password } = request.body;

  try {
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists)
      return response.status(400).json({ error: 'User already exists ' });

    const user = await User.create({ name, email, password });

    user.password = undefined;
    return response.json({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return response.status(400).json({ error: 'Registration error!' });
  };
});

routes.post('/authenticate', async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) return response.status(400).json({ error: 'User not Found!' });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch)
    return response.status(400).json({ error: 'Email/Password invalid' });

  user.password = undefined;

  return response.json({ 
    user, 
    token: generateToken({ id: user.id }) 
  });
});


module.exports = routes;