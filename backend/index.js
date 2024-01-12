
const express = require('express');
const connectDB = require('./db'); 
var cors = require('cors') 

connectDB();
const app = express();
const port = 5000;

app.use(cors())
app.use(express.json())
// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(` INoteBook Backend listening on http://localhost:${port}`);
});

