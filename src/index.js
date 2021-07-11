const express = require('express');
const app = express();

const routes = require('./routes');
const router = require('./controllers/projectController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(router);


app.listen(3333, () => console.log('Server is running on PORT:3333'));