const connectDB = require('./config/connectDB'); //conexion a la base

const Productos = require('./models/product'); //modelo de la coleccion 

const productJson = require('./datos.json');

require('dotenv').config();


// //Funcion que activa la conexion 
const iniciar = async () => {
    try {
        await connectDB(process.env.MONGO_URL) //URL de entorno 


        await Productos.create(productJson) //Enviamos toda la data a la coleccion 
        console.log('Se ejecuto el cambio');

    } catch (error) {
        console.log(error)
    }
}

iniciar(); 
