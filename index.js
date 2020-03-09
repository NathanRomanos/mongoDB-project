const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const product = require('./products.json');
const dbProduct = require('./models/products.js');
const User = require('./models/users.js');
const Product = require('./models/products.js');

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



app.use((req,res,next) =>{
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.get('/', (req, res) => res.send('Hello World moment'));

app.get('/allProducts', (req,res)=>{
  res.json(product);
});



app.get('/products/p=:id', (req,res)=>{
  const idParam = req.params.id;

  for (let i=0; i < product.length; i++){

    if (idParam.toString() === product[i].id.toString()) {
      res.json(product[i]);
    }
  }
})


//register user
app.post('/registerUser', (req,res)=>{

  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult) {
      res.send('no')
    } else {
      const hash = bcryptjs.hashSync(req.body.password);
      const user = new User({
        _id : new mongoose.Types.ObjectId,
        username : req.body.username,
        email : req.body.email,
        password : hash
      });

      user.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err))
    }
  })

});

//get all users
app.get('/allUsers', (req,res)=>{
  User.find().then(result =>{
    res.send(result);
  })
});


//login the user
app.post('/loginUser', (req,res)=>{
  User.findOne({username:req.body.username}, (err,userResult)=>{
    if (userResult) {
      if (bcryptjs.compareSync(req.body.password, userResult.password)) {
        res.send(userResult);
      } else {
        res.send('not authorized');
      } //inner if statement
    } else {
      res.send('user not found. Please register');
    } //outer if statement
  }); //findOne
}); //post



//register product
app.post('/registerProduct', (req,res)=>{

  Product.findOne({name:req.body.name},(err,productResult)=>{
    if (productResult) {
      res.send('no')
    } else {
      const productData = new Product({
        _id : new mongoose.Types.ObjectId,
        name : req.body.name,
        last_name : req.body.last_name,
        price : req.body.price
      });

      productData.save().then(result =>{
        res.send(result);
      }).catch(err => res.send(err))
    }
  })

});

//get all users
app.get('/allProducts', (req,res)=>{
  Product.find().then(result =>{
    res.send(result);
  })
});


//Search for price
app.post('/searchProduct', (req,res)=>{
  Product.findOne({name:req.body.name}, (err,productResult)=>{
    if (productResult) {
      res.send(productResult);
    } else {
      res.send('Product not found. Please eat something else');
    } //if statement
  }); //findOne
}); //post


//delete a product
app.delete('/deleteProduct/:id', (req,res)=>{
  const idParam = req.params.id;
  Product.findOne({_id:idParam}, (err,product)=>{
    if (product) {
      Product.deleteOne({_id:idParam},err=>{
        res.send('deleted');
      });
    } else {
      res.send('not found');
    }
  }).catch(err=> res.send(err));//findOne
}); //delete


//update a product
app.patch('/updateProduct/:id',(res,req)=>{
  const idParam = req.params.id;
  Product.findById(idParam,(err,product)=>{
    const updatedProduct ={
      name: req.body.name,
      last_name: req.body.last_name,
      price: req.body.price
    };
    Product.updateOne({_id:idParam}, updatedProduct).then(result=>{
      res.send(result);
    }).catch(err=>res.send(err));

  }).catch(err=>res.send('not found'));

});


//keep this always at the bottom so that you can see the errors reported
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
