const fs = require('fs');
const path = require('path');

// Caminho da pasta uploads
const uploadsPath = path.join(__dirname, 'uploads');

// Testa se a pasta existe e podemos gravar nela
fs.access(uploadsPath, fs.constants.W_OK, (err) => {
  if (err) {
    console.error('A pasta não tem permissão de gravação:', err);
  } else {
    console.log('Permissões de gravação confirmadas na pasta uploads.');
  }
});
