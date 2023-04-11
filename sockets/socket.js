const {
  usuarioConectado,
  usuarioDesconectado,
  constGuardarMsg,
} = require('../controller/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');

// Mensajes de Sockets
io.on('connection', (client) => {
  //console.log(client.handshake.headers['x-token'], 'hand');

  const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

  if (!valido) {
    return client.disconnect();
  }

  console.log('Cliente autenticado');
  usuarioConectado(uid);

  //sala global
  client.join(uid);
  //Escuchar mensaje personal
  client.on('mensaje-personal', async (payload) => {
    console.log(payload);
    await constGuardarMsg(payload);
    io.to(payload.para).emit('mensaje-personal', payload);
  });

  client.on('disconnect', () => {
    usuarioDesconectado(uid);
    console.log('Cliente desconectado');
  });

  // client.on('mensaje', ( payload ) => {
  //     console.log('Mensaje', payload);

  //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

  // });
});
