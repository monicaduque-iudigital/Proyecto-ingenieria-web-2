const Genero = require('../models/Genero');
const { request, response } = require('express');

const getGeneros = async (req = request, res = response) => {
    try {
        const generos = await Genero.find();
        res.status(200).json(generos);
    } catch (error) {
        console.error('❌ Error al obtener géneros:', error);
        res.status(500).json({ msg: 'Ocurrió un error al listar los géneros' });
    }
}

const createGenero = async (req = request, res = response) => {
    try {
        const { nombre, descripcion } = req.body;

        const generoDB = await Genero.findOne({ nombre });
        if (generoDB) {
            return res.status(400).json({ msg: `El género "${nombre}" ya existe.` });
        }

        const genero = new Genero({ nombre, descripcion });

        await genero.save();
        res.status(201).json(genero);

    } catch (error) {
        console.error('❌ Error al crear género:', error);
        res.status(500).json({ msg: 'Ocurrió un error al guardar el género' });
    }
}

module.exports = {
    getGeneros,
    createGenero
}