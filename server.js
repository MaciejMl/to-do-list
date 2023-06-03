const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.listen(8000, () => {
  console.log('Srever started on port: ', 8000);
});
