const File = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = async (req, res) => {
  if (!req.files || !req.files.sampleFile) {
    return res.status(400).json({ error: 'No files were uploaded!' });
  }

  // console.log(req.files);
  const { sampleFile } = req.files;

  try {
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({ message: 'File Store Success', fileId: doc._id })
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong' });
  }
};

const retrieveFile = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    doc = await File.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving' });
  }
  if (!doc) {
    return res.status(404).json({ error: 'Image not found!' });

  }

  res.set({
    'Content-Type':doc.mimeType,
    'Content-Length':doc.size,
    'Content-Disposition':`inline; filename="${doc.name}"`,
  });
  return res.send(doc.data);
};

module.exports = {
  uploadPage,
  uploadFile,
  retrieveFile
}