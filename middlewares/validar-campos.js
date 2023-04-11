const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      err: errors.mapped(),
    });
  }

  next();
};

module.exports = {
  validarCampos,
};
