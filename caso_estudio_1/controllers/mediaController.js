const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const { request, response } = require('express');

const getMedias = async (req = request, res = response) => {
    try {
        const medias = await Media.find()
            .populate('generoPrincipal', 'nombre')
            .populate('directorPrincipal', 'nombre')
            .populate('productora', 'nombre')
            .populate('tipo', 'nombre');
        res.status(200).json(medias);
    } catch (error) {
        console.error('❌ Error al obtener medias:', error);
        res.status(500).json({ msg: 'Ocurrió un error al listar las medias' });
    }
}

const createMedia = async (req = request, res = response) => {
    try {
        const { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, 
                generoPrincipal, directorPrincipal, productora, tipo } = req.body;

        // Verificar que el serial y URL no existan
        const mediaDB = await Media.findOne({ $or: [{ serial }, { url }] });
        if (mediaDB) {
            if (mediaDB.serial === serial) {
                return res.status(400).json({ msg: `El serial "${serial}" ya existe.` });
            }
            if (mediaDB.url === url) {
                return res.status(400).json({ msg: `La URL "${url}" ya existe.` });
            }
        }

        // Verificar que los relacionados existan y estén activos
        const genero = await Genero.findById(generoPrincipal);
        if (!genero || genero.estado !== 'Activo') {
            return res.status(400).json({ msg: 'El género seleccionado no existe o no está activo' });
        }

        const director = await Director.findById(directorPrincipal);
        if (!director || director.estado !== 'Activo') {
            return res.status(400).json({ msg: 'El director seleccionado no existe o no está activo' });
        }

        const productoraDB = await Productora.findById(productora);
        if (!productoraDB || productoraDB.estado !== 'Activo') {
            return res.status(400).json({ msg: 'La productora seleccionada no existe o no está activa' });
        }

        const tipoDB = await Tipo.findById(tipo);
        if (!tipoDB) {
            return res.status(400).json({ msg: 'El tipo seleccionado no existe' });
        }

        const media = new Media({
            serial, titulo, sinopsis, url, imagenPortada, anioEstreno,
            generoPrincipal, directorPrincipal, productora, tipo
        });

        await media.save();
        
        const mediaConPopulate = await Media.findById(media._id)
            .populate('generoPrincipal', 'nombre')
            .populate('directorPrincipal', 'nombre')
            .populate('productora', 'nombre')
            .populate('tipo', 'nombre');

        res.status(201).json(mediaConPopulate);

    } catch (error) {
        console.error('❌ Error al crear media:', error);
        res.status(500).json({ msg: 'Ocurrió un error al guardar la media' });
    }
}

const updateMedia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, 
                generoPrincipal, directorPrincipal, productora, tipo } = req.body;

        // Verificar que los relacionados existan y estén activos
        if (generoPrincipal) {
            const genero = await Genero.findById(generoPrincipal);
            if (!genero || genero.estado !== 'Activo') {
                return res.status(400).json({ msg: 'El género seleccionado no existe o no está activo' });
            }
        }

        if (directorPrincipal) {
            const director = await Director.findById(directorPrincipal);
            if (!director || director.estado !== 'Activo') {
                return res.status(400).json({ msg: 'El director seleccionado no existe o no está activo' });
            }
        }

        if (productora) {
            const productoraDB = await Productora.findById(productora);
            if (!productoraDB || productoraDB.estado !== 'Activo') {
                return res.status(400).json({ msg: 'La productora seleccionada no existe o no está activa' });
            }
        }

        if (tipo) {
            const tipoDB = await Tipo.findById(tipo);
            if (!tipoDB) {
                return res.status(400).json({ msg: 'El tipo seleccionado no existe' });
            }
        }

        const media = await Media.findByIdAndUpdate(
            id,
            { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, 
              generoPrincipal, directorPrincipal, productora, tipo, 
              fechaActualizacion: Date.now() },
            { returnDocument: 'after', runValidators: true }
        )
            .populate('generoPrincipal', 'nombre')
            .populate('directorPrincipal', 'nombre')
            .populate('productora', 'nombre')
            .populate('tipo', 'nombre');

        if (!media) {
            return res.status(404).json({ msg: 'Media no encontrada' });
        }

        res.status(200).json(media);

    } catch (error) {
        console.error('❌ Error al actualizar media:', error);
        res.status(500).json({ msg: 'Ocurrió un error al actualizar la media' });
    }
}

const deleteMedia = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const media = await Media.findByIdAndDelete(id);

        if (!media) {
            return res.status(404).json({ msg: 'Media no encontrada' });
        }

        res.status(200).json({ msg: 'Media eliminada correctamente' });

    } catch (error) {
        console.error('❌ Error al eliminar media:', error);
        res.status(500).json({ msg: 'Ocurrió un error al eliminar la media' });
    }
}

module.exports = {
    getMedias,
    createMedia,
    updateMedia,
    deleteMedia
}
