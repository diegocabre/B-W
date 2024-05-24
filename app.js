const express = require('express');
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

// Ruta raíz que devuelve el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para procesar la imagen
app.post('/process-image', async (req, res) => {
  const imageUrl = req.body.imageUrl;
  console.log(`Received image URL: ${imageUrl}`); // Punto de depuración

  try {
    const image = await Jimp.read(imageUrl);
    const fileName = `${uuidv4().slice(0, 8)}.jpg`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    image
      .resize(350, Jimp.AUTO)
      .grayscale()
      .write(filePath, () => {
        console.log(`Processed image saved as: ${filePath}`); // Punto de depuración
        res.sendFile(filePath);
      });
  } catch (error) {
    console.error(`error: ${error.message}`); // Punto de depuración
    res.status(500).send('Error procesando la imagen, intenta nuevamente.');
  }
});

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`);
});