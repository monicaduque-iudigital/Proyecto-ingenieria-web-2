require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

const { getConnection } = require('./db/db-connection-mongo');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); 
app.use(express.json());

/* --- Routes --- */
app.use('/api/genero', require('./routes/genero')); 
app.use('/api/directores', require('./routes/director'));
app.use('/api/productora', require('./routes/productora'));
app.use('/api/tipo', require('./routes/tipo'));
app.use('/api/media', require('./routes/media'));

getConnection();

app.listen(port, () => {
    console.log(`--- Servidor corriendo en el puerto ${port} ---`);
});