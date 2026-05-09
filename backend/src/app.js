const express = require('express');
const cors = require('cors');
const { configureEnvironment } = require('./config/environment');
const errorMiddleware = require('./middleware/error.middleware');
const routes = require('./routes');

configureEnvironment();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SIGR API', version: '1.0.0' });
});

app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
