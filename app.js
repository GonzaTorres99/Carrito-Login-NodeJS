const express = require('express');
const session = require('express-session');
const app = express();
require('dotenv').config();
const connectDB = require('./config/connectDB');
const productsRouter = require('./routes/products');
const carritoController = require('./controllers/carrito');
const User = require('./models/user'); 
const bcrypt = require('bcrypt');
const Productos = require('./models/product'); // Importa el modelo de productos

// Middleware
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesion 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Middleware para manejar los mensajes flash y autenticación
app.use((req, res, next) => {
    console.log('Middleware: user en sesión:', req.session.user);
    res.locals.success_msg = req.session.success_msg || '';
    res.locals.error_msg = req.session.error_msg || '';
    res.locals.user = req.session.user || null;
    delete req.session.success_msg;
    delete req.session.error_msg;
    next();
});

// Rutas
app.use('/productos', productsRouter);
app.get('/carrito', carritoController.mostrarCarrito);
app.post('/finalizar-compra', carritoController.finalizarCompra);
app.post('/eliminar-producto', carritoController.eliminarProductoDelCarrito);

// Ruta para obtener y renderizar productos en la página de inicio
app.get('/', async (req, res) => {
    try {
        const productos = await Productos.find();
        res.render('page/home', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Otras rutas
app.get('/login', (req, res) => {
    res.render('page/login');
});

app.get('/register', (req, res) => {
    res.render('page/register');
});

// Ruta Post para registrar usuarios
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            req.session.error_msg = 'El usuario ya existe';
            return res.redirect('/register');
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        req.session.success_msg = 'Usuario creado correctamente';
        res.redirect('/login');
    } catch (error) {
        req.session.error_msg = 'Error en el servidor';
        res.redirect('/register');
    }
});

// Ruta Post para iniciar sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.session.error_msg = 'Usuario no encontrado';
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.session.error_msg = 'Contraseña incorrecta';
            return res.redirect('/login');
        }

        req.session.user = user;
        req.session.success_msg = 'Inicio de sesión exitoso';
        res.redirect('/');
    } catch (error) {
        req.session.error_msg = 'Error en el servidor';
        res.redirect('/login');
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
});

// Conectar a la base de datos y comenzar el servidor
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
});
