const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Media } = require('../models');

const upload = require('../middlewares/fileMulter');
const {
  insertDocument,
  updateDocument,
  findDocument,

} = require('../helper/MongoDbHelper');

router.post('/upload-single', (req, res, next) =>
  upload.single('image')(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: 'MulterError', err: err });
      } else if (err) {
        console.log('««««« err »»»»»', err);
        res.status(500).json({ type: 'UnknownError', err: err });
      } else {
        // const response = await insertDocument(
        //   {
        //     location: req.file.path,
        //     name: req.file.filename,
        //     employeeId: req.user._id,
        //     size: req.file.size,
        //   },
        //   'Media',
        // );
        const media = new Media({
          location: req.file.path,
          name: req.file.filename,
          employeeId: req.user._id,
          size: req.file.size,
        });

        const response = await media.save();

        res.status(200).json({ ok: true, payload: response });
      }
    } catch (error) {
      console.log('««««« error »»»»»', error);
      res.status(500).json({ message: "Upload file error", error });
    }
  }),
);

router.post('/upload-multiple', (req, res) =>
  upload.array('files', 3)(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: 'MulterError', err: err });
      } else if (err) {
        res.status(500).json({ type: 'UnknownError', err: err });
      } else {
        const files = req.files;

        const dataInsert = files.reduce((prev, nextP) => {
          prev.push({ name: nextP.filename, location: nextP.path });
          return prev;
        }, []);

        const response = await insertDocuments(dataInsert, 'Media');

        res.status(200).json({ ok: true, payload: response });
      }
    } catch (error) {
      console.log('««««« err »»»»»', err);

      res.status(500).json({ ok: false, error });
    }
  }),
);

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  const found = await findDocument(id, 'Media');
  if (!found) {
    return res
      .status(410)
      .json({ message: `${collectionName} with id ${id} not found` });
  }

  res.status(200).json({ ok: true, payload: found });
});

router.post('/media/update/:id', async (req, res) => {
  const { id } = req.params;

  const found = await findDocument(id, 'Media');
  if (!found) res.status(410).json({ message: `${collectionName} with id ${id} not found` });

  upload.single('file')(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: 'MulterError', err: err });
      } else if (err) {
        res.status(500).json({ type: 'UnknownError', err: err });
      } else {
        const imageUrl = `/uploads/media/${req.file.filename}`;
        const name = req.file.filename;

        const response = await updateDocument(
          { _id: id },
          {
            location: imageUrl,
            name,
          },
          'Media',
        );

        res.status(200).json({ ok: true, payload: response });
      }
    } catch (error) {
      res.status(500).json({ ok: false, error });
    }
  });
});

module.exports = router;