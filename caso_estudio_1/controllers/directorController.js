const Director = require('../models/Director');
const { request, response } = require('express');

const getDirectores = async (req = request, res = response) => {
    try {
        const directores = await Director.find();
        res.status(200).json(directores);
    } catch (error) {
        console.error('❌ Error al obtener directores:', error);
        res.status(500).json({ msg: 'Ocurrió un error al listar los directores' });
    }
}

const createDirector = async (req = request, res = response) => {
    try {
        const { nombre } = req.body;

        const director = new Director({ nombre });

        await director.save();
        res.status(201).json(director);

    } catch (error) {
        console.error('❌ Error al crear director:', error);
        res.status(500).json({ msg: 'Ocurrió un error al guardar el director' });
    }
}

const updateDirector = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, estado } = req.body;

        const director = await Director.findByIdAndUpdate(
            id,
            { nombre, estado, fechaActualizacion: Date.now() },
            { new: true, runValidators: true }
        );

        if (!director) {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }

        res.status(200).json(director);

    } catch (error) {
        console.error('❌ Error al actualizar director:', error);
        res.status(500).json({ msg: 'Ocurrió un error al actualizar el director' });
    }
}

module.exports = {
    getDirectores,
    createDirector,
    updateDirector
}