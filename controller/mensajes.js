const { response } = require('express');

const Mensaje = require('../models/mensaje');

const obtenerChat = async (req, res = response) => {
  const miId = req.uid;
  console.log(miId, 'miId');
  const mensajesDe = req.params.de;
  console.log(mensajesDe, 'mensajesDe');
  const las30Msg = await Mensaje.find({
    $or: [
      { de: miId, para: mensajesDe },
      { de: mensajesDe, para: miId },
    ],
  })
    .sort({ createdAt: 'desc' })
    .limit(30);
  res.json({
    ok: true,
    mensajes: las30Msg,
  });
};

module.exports = {
  obtenerChat,
};
