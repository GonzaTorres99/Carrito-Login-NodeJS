const Productos = require('../models/product');

const obtenerTodosLosProductos = async (req, res) => {
    try {
        const products = await Productos.find();
        console.log('Todo bien, se realizo la busqueda');
        res.render('page/catalogo', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
};

module.exports = {
    obtenerTodosLosProductos
};
