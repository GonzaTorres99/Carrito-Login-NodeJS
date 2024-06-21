const express = require('express');
const router = express.Router();
const { obtenerTodosLosProductos } = require('../controllers/products');
const { agregarProductoAlCarrito, mostrarCarrito, finalizarCompra, eliminarProductoDelCarrito } = require('../controllers/carrito');

router.route('/catalogo').get(obtenerTodosLosProductos);
router.route('/carrito').post(agregarProductoAlCarrito).get(mostrarCarrito);
router.route('/finalizar-compra').post(finalizarCompra);
router.route('/eliminar-producto').post(eliminarProductoDelCarrito);

module.exports = router;
