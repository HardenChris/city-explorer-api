'use strict'

require('dotenv').config();
const express = require('express')
const cors = require('cors');
const { response } = require('express');

const app = express();

app.use(cors());

const PORT = process.env.PORT

app.get('/test', (req, res) => {res.send('Hello, I work and ready for lab!')});


app.listen(PORT, () => console.log(`I am listening on port: ${PORT}`));