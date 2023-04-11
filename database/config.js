const mongoose = require('mongoose');

const dbCConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Base de datos online');
  } catch (error) {
    console.log(error);
    throw new Error('Error en la base de datos');
  }
};

module.exports = {
  dbCConnection,
};
