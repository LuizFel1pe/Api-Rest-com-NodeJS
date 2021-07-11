const User = require('../models/User');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');


module.exports = {
  async forgotMyPassword(request, response) {
    const { email } = request.body;

    try {
      const user = await User.findOne({ email });

      if (!user) return response.status(400).json({ error: 'User not found ' });

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      }, { new: true, useFindAndModify: false });

      mailer.sendMail({
        to: email,
        from: 'luizfelipev166@gmail.com',
        template: 'auth/forgot_password',
        context: { token }
      }, err => {
        if (err) {
          return response.status(400)
            .json({ error: 'Cannot send forgot password email' });
        }

        return response.send();
      });

    } catch (err) {
      response.status(400).json({ error: 'Error on forgot password try again! ' });
    }
  },

  async resetMyPassword(request, response) {
    const { email, token, password } = request.body;

    try {
      const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');

      if (!user) return response.status(400).json({ error: 'User not found ' });

      if (token !== user.passwordResetToken)
        return response.status(400).json({ error: 'Token invalid' });

      const now = new Date();

      if (now > user.passwordResetExpires) 
        return response.status(400).json({ error: 'Token expired' });

      user.password = password;

      await user.save();

      response.send();
    } catch (err) {
      response.status(400).json({ error: 'Cannot reset password try again!' });
    }
  }
}