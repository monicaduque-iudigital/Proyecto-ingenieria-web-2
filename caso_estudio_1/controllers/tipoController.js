const Tipo = require('../models/Tipo');
const { request, response } = require('express');

const getTipos = async (req = request, res = response) => {
    try {
        const tipos = await Tipo.find();
        res.status(200).json(tipos);
    } catch (error) {
        console.error('❌ Error al obtener tipos:', error);
        res.status(500).json({ msg: 'Ocurrió un error al listar los tipos' });
    }
}

const createTipo = async (req = request, res = response) => {
    try {
        const { nombre, descripcion } = req.body;

        const tipoDB = await Tipo.findOne({ nombre });
        if (tipoDB) {
            return res.status(400).json({ msg: `El tipo "${nombre}" ya existe.` });
        }

        const tipo = new Tipo({ nombre, descripcion });

        await tipo.save();
        res.status(201).json(tipo);

    } catch (error) {
        console.error('❌ Error al crear tipo:', error);
        res.status(500).json({ msg: 'Ocurrió un error al guardar el tipo' });
    }
}

const updateTipo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const tipo = await Tipo.findByIdAndUpdate(
            id,
            { nombre, descripcion, fechaActualizacion: Date.now() },
            { new: true, runValidators: true }
        );

        if (!tipo) {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }

        res.status(200).json(tipo);

    } catch (error) {
        console.error('❌ Error al actualizar tipo:', error);
        res.status(500).json({ msg: 'Ocurrió un error al actualizar el tipo' });
    }
}

module.exports = {
    getTipos,
    createTipo,
    updateTipo
}
