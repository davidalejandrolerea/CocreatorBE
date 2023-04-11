const express = require('express');
const path = require('path');
require('dotenv').config();

//DB Config

const { dbCConnection } = require('./database/config');
dbCConnection();

// App de Express
const app = express();

//Lectura y parseo del body

app.use(express.json());

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');


// middleware
app.use('/api/uploads', express.static('uploads'));   // Make uploads folder to make it accessible from browser
app.use(express.json());    // For Json Data

// Rutas

app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));
app.use('/api/blogPost', require('./routes/blogpost'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/qbbalance', require('./routes/qbbalance'));
app.use('/api/pregunta', require('./routes/pregunta'));
app.use('/api/transactionlist', require('./routes/transactionlist'));
// Question de Personalidad
app.use('/api/personalityquestion', require('./routes/personalityquestion'));
// Answer de Personalidad
app.use('/api/personalityanswer', require('./routes/personalityanswer'));
// like de Respuesta del chat
app.use('/api/likegptanswer', require('./routes/likegptanswer'))

// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);

  console.log('Servidor corriendo en puerto', process.env.PORT);
});
