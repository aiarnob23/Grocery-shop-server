const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_HANDLE}:${process.env.USER_PASSWORD}@cluster0.z280lkm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    const productsCollection = client.db("airGrocery").collection('products');
    const cartCollection = client.db("airGrocery").collection('userCart');

    //product get by query
   app.get('/products',async(req,res)=>{
    try{
        let query={};
        if(req.query?.category){
            query={category:req.query.category};
        }
        const result = await productsCollection.find(query).toArray();
        res.send(result);
    }
    catch(error){
        console.log(error);
    }
   })

   //cart handle.......
   //cart post
   app.post('/cart',async(req,res)=>{
    const product = req.body;
    const result = await cartCollection.insertOne(product);
    res.send(result);
   })
   //get cart products
   app.get('/cart', async(req,res)=>{
    const cursor = cartCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Air Grocery')
})

app.listen(port,()=>{
    console.log(('running'));
})