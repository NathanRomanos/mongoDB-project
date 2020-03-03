//Connection String Only:
mongodb+srv://Admin:<password>@cluster0-lrfe3.mongodb.net/test?retryWrites=true&w=majority



//Full Driver Example:
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Admin:<password>@cluster0-lrfe3.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



//Replace <password> with the password for the Admin user.
When entering your password, make sure that any special characters are URL encoded.
