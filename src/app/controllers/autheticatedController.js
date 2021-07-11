const bcrypt = require('bcryptjs');
const generateToken = require('../services/generateToken');
const User = require('../models/User');

module.exports = {
  async autheticate(request, response) {
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
  }
}  