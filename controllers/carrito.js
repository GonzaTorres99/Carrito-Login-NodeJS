const Productos = require('../models/product');

const agregarProductoAlCarrito = async (req, res) => {
    const { productId, cantidad } = req.body;

    if (!req.session.user) {
        return res.status(401).json({ message: 'Debes iniciar sesión para agregar al carrito.' });
    }

    if (!req.session.carrito) {
        req.session.carrito = [];
    }

    const producto = await Productos.findById(productId);

    if (producto) {
        const productoEnCarrito = req.session.carrito.find(item => item.producto._id == productId);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += parseInt(cantidad);
        } else {
            req.session.carrito.push({ producto, cantidad: parseInt(cantidad) });
        }
    }

    res.status(200).json({ message: 'Producto enviado al carrito' });
};

const mostrarCarrito = (req, res) => {
    const carrito = req.session.carrito || [];
    const total = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
    res.render('page/carrito', { carrito, total });
};

const finalizarCompra = (req, res) => {
    req.session.carrito = [];
    res.status(200).json({ message: '¡Felicidades! Compra realizada con éxito' });
};

const eliminarProductoDelCarrito = (req, res) => {
    const { productId } = req.body;

    console.log('Solicitud para eliminar producto recibida. ProductId:', productId);

    req.session.carrito = req.session.carrito.filter(item => item.producto._id !== productId);

    console.log('Carrito actualizado:', req.session.carrito);

    const total = req.session.carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);

    res.status(200).json({ message: 'Producto eliminado', total });
};

module.exports = { agregarProductoAlCarrito, mostrarCarrito, finalizarCompra, eliminarProductoDelCarrito };
