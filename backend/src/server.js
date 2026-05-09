const app = require('./app');
const { PORT } = require('./config/environment');

app.listen(PORT, () => {
  console.log(`SIGR API corriendo en puerto ${PORT}`);
});
