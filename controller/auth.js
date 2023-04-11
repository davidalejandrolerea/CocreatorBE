const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

  const {name, email, password } = req.body;

  try {

      const existeEmail = await Usuario.findOne({ email });


      if (existeEmail) {
          return res.status(400).json({
              ok: false,
              msg: 'El correo ya esta registrado'
          });
      }

      const usuario = new Usuario(req.body);

      // Encriptar contraseña
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(password, salt);

      await usuario.save();

      // Generar JWT
      const token = await generarJwt(usuario.id);

      res.json({
          ok: true,
          msg: 'Crear usuario!!!!',
          usuario,
          token
      });

  } catch (error) {
      console.log(error);
      res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }


};

const login = async(req, res = response) => {

  const { email, password } = req.body;


  try {

      const usuarioDB = await Usuario.findOne({ email });

      if (!usuarioDB) {
          return res.status(400).json({
              ok: false,
              msg: 'Email no encontrado'
          });
      }

      // Validar password
      const validPassword = bcrypt.compareSync(password, usuarioDB.password);
      if (!validPassword) {
          return res.status(400).json({
              ok: false,
              msg: 'Contraseña incorrecta'
          });
      }

      // Generar JWT
      const token = await generarJwt(usuarioDB.id);

      res.json({
          ok: true,
          msg: 'login',
          usuario: usuarioDB,
          token
      });

  } catch (error) {
      console.log(error);
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador',
          err: error
      });
  }
};

const renewToken = async(req, res = response) => {

  const uid = req.uid;

  const token = await generarJwt(uid);

  const usuario = await Usuario.findById(uid);

  res.json({
      ok: true,
      msg: 'ok',
      usuario,
      token
  });
};

const update1 = async(req, res = response) => {
    const { businessName, business, roles, employees } = req.body;
    const uid = req.uid;

  try {
   
    let usuario = await Usuario.findById(uid);

    usuario.business= business;
    usuario.businessName = businessName;
    usuario.employees= employees;
    usuario.roles= roles;
    

    usuario = await usuario.save();

      res.status(200).json({
      ok: true,
      msg: 'ok',
      usuario,
    //   token
    
  });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }

};

module.exports = {
  crearUsuario,
  login,
  renewToken,
  update1
};
