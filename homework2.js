const express = require('express');
const app = express();

let randomNumber = null;

app.get('/start', (req, res) => {
  randomNumber = Math.floor(Math.random() * 101);
  res.send('OK');
});

app.get('/:number', (req, res) => {
  const number = parseInt(req.params.number);
  
  if (number < randomNumber) {
    res.send('smaller');
  } else if (number > randomNumber) {
    res.send('bigger');
  } else {
    res.send('equal');
    randomNumber = Math.floor(Math.random() * 101);
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});