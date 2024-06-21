const mongoose = require('mongoose');

const productosEsquema = new mongoose.Schema({

    nombre: String,
    precio: Number,
    oferta: Boolean,
    precio_oferta: Number,
    imagen: String,
    descripcion: String,
    stock: Number,
}); 
//                               Coleccion
const Productos = mongoose.model('Productos', productosEsquema)

module.exports = Productos; 