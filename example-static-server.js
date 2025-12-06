const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

const port = 80;
app.listen(port, () =>
  console.log(`Example static server listening on port ${port}!`)
);
