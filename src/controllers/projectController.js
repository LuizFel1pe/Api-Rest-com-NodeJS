const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.get('/projects', (request, response) => {
  return response.send('ok');
});

module.exports = router;