const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  name: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    require: true,
  },

  online: {
    type: Boolean,
    default: false,
  },
  businessName: {
    type: String,
    default: 'a'
  },
  business: {
    type: String,
    default: 'a'
  },
  roles: {
    type: String,
    default: 'a'
  },
  employees: {
    type: String,
    default: 'a'
  },
});

UsuarioSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});
module.exports = model('Usuario', UsuarioSchema);
//boradps
