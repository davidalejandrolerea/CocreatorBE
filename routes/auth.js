/*

    path: api/login

*/

const { Router } = require('express');
const { crearUsuario, login, renewToken, update1 } = require('../controller/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('email').not().isEmpty().withMessage('El email es ().isEmpty(),obligatorio').isEmail().withMessage('El email es inválido'),
    check('password').not().isEmpty().withMessage('El password es obligatorio').isLength({ 'min': 6 }).withMessage('El password debe contener por lo menos 6 caracteres'),
    validarCampos
], crearUsuario);

router.post('/', [
    check('email').not().isEmpty().withMessage('El email es obligatorio').isEmail().withMessage('El email es inválido'),
    check('password').not().isEmpty().withMessage('El password es obligatorio'),
    validarCampos
], login);

// router.post('/update', [
//     check('businessName', 'El nombre es obligatorio').not,
//     check('business').not().isEmpty().withMessage('business es obligatorio'),
//     check('employees').not().isEmpty().withMessage('employees es obligatorio'),
//     validarCampos
// ], update1);

router.post('/update',validarJwt, update1);


router.get('/renew', validarJwt, renewToken);

module.exports = router;