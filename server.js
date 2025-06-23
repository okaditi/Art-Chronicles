const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer();
const PORT = 5000;

app.use(cors());

// Health check
app.get('/ping', (req, res) => res.send('IPFS Server Alive'));

// IPFS Upload Route
app.post('/upload', upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);

  const metadata = {
    name: title || file.originalname,
    keyvalues: {
      description: description || '',
      uploadedAt: new Date().toISOString()
    }
  };

  formData.append('pinataMetadata', JSON.stringify(metadata));
  formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY
        }
      }
    );

    const hash = response.data.IpfsHash;
    res.json({ IpfsHash: hash });
  } catch (err) {
    console.error('❌ Pinata upload failed:', err?.response?.data || err.message || err);
    res.status(500).send({
      error: 'IPFS upload failed',
      details: err?.response?.data || err.message || err
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 IPFS server running at http://localhost:${PORT}`);
});
