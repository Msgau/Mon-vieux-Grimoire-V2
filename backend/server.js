const http = require('http'); //importe le package http de node, qui nous permet de créer un serveur
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const errorHandler = error => { // la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); //  On appelle la méthode createServer du package http. 
// Cette méthode prend comme argument la fonction qui sera appelée à chaque requête reçue par le serveur.
// A chaque fois qu'on envoie une requête au serveur, on appelle cette fonction qui reçoit 1 argument : app
// app est l'application express qui appelle 2 arguments : req (requête) et res (réponse)

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // La méthode listen permet au serveur d'écouter les requêtes envoyées