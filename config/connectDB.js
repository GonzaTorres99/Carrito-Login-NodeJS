const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Se conectó a la base de datos correctamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1); // Salir de la aplicación con código de error
    }
}

module.exports = connectDB;