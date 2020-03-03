const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json')

const port = 3000;


// const mongodbURI = 'mongodb+srv://Admin:244466666@cluster0-lrfe3.mongodb.net/test?retryWrites=true&w=majority';
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('DB connected'))
.catch(err =>{
  console.log(`DBConnectionError: ${err.message}`);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to mongo db');
});


app.get('/', (req, res) => res.send('Bruh'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
