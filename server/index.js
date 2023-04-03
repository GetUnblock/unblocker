const path = require('path');
const express = require('express');
const app = express(); // create express app

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server started on port 3000 or other');
});