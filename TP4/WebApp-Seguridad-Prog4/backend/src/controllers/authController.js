const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const login = async (req, res) => {
    const { username, password, captcha } = req.body;
    
    // Usamos una IP por defecto si estamos en local
    const ipCliente = req.ip || '::1';

    // Usamos locals para que no se borre la memoria entre tests
    if (!req.app.locals.intentosFallidos) {
        req.app.locals.intentosFallidos = {};
    }
    
    const historial = req.app.locals.intentosFallidos;

    // Inicializo el contador si es la primera vez
    if (!historial[ipCliente]) {
        historial[ipCliente] = { cantidad: 0 };
    }

    const datosIP = historial[ipCliente];

    // 1. Delay: Si ya viene fallando, lo hacemos esperar un toque
    if (datosIP.cantidad > 0) {
        // 600ms de espera para frenar el brute force
        await new Promise(r => setTimeout(r, 600)); 
    }

    // 2. Bloqueo total si se pasa de rosca (5 intentos)
    if (datosIP.cantidad >= 5) {
        return res.status(429).json({ error: 'Demasiados intentos. Intente más tarde.' });
    }

    // 3. Pedir Captcha si ya falló un par de veces
    if (datosIP.cantidad >= 3 && !captcha) {
        return res.status(400).json({ error: 'Se requiere verificación de captcha' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    
    db.query(query, [username], async (err, resultados) => {
        if (err) {
            // Si falla la base, cuento como intento fallido por seguridad
            datosIP.cantidad++;
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        // Si no encuentra el usuario, aumentamos contador
        if (resultados.length === 0) {
            datosIP.cantidad++;
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const usuarioEncontrado = resultados[0];
        const passValida = await bcrypt.compare(password, usuarioEncontrado.password);
        
        if (!passValida) {
            datosIP.cantidad++;
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Si llega aca es porque esta todo bien, reseteo los intentos
        datosIP.cantidad = 0;

        // Genero el token acá adentro que es donde tengo los datos del usuario
        const token = jwt.sign(
            { id: usuarioEncontrado.id, username: usuarioEncontrado.username }, 
            process.env.JWT_SECRET || 'supersecret123'
        );
        
        res.json({ token, username: usuarioEncontrado.username });
    });
};

const register = async (req, res) => {
    const { username, password, email } = req.body;
    
    // Encriptamos la pass antes de guardar
    const passHasheada = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    
    db.query(query, [username, passHasheada, email], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        res.json({ message: 'Usuario registrado con éxito' });
    });
};

const verifyToken = (req, res) => {
    const cabecera = req.headers.authorization;
    const token = cabecera ? cabecera.split(' ')[1] : null;
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
        req.session.userId = decodificado.id;
        res.json({ valid: true, user: decodificado });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const checkUsername = (req, res) => {
    const { username } = req.body;
    
    const query = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
    
    db.query(query, [username], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error en base de datos' });
        }
        
        const existe = resultados[0].count > 0;
        res.json({ exists: existe });
    });
};

module.exports = {
    login,
    register,
    verifyToken,
    checkUsername
};