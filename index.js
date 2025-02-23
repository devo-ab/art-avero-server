const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware start
app.use(cors());
app.use(express.json())
// app.use(cors({origin:["localhos","live link"]}));
// middleware end


// mongodb database start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfuxqes.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const artCollection = client.db("artDB").collection("art");
    const summerCollection = client.db("artDB").collection("summerSale");
    const dataCollection = client.db("artDB").collection("categories");


    // api start
    app.post('/crafts',async(req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await artCollection.insertOne(newArt);
      res.send(result)
    });

    app.get('/crafts',async(req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/crafts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await artCollection.findOne(query);
      res.send(result)
    });

    app.get('/my-art-craft/:email',async(req,res) => {
      console.log(req.params.email)
      const result = await artCollection.find({user_email: req.params.email}).toArray();
      res.send(result)
    });

    app.delete('/craft/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = {_id : new ObjectId(id)};
      const result = await artCollection.deleteOne(query);
      res.send(result)
    });

    app.get('/summerSale', async(req,res) => {
      const cursor = summerCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.put('/crafts/:id', async(req,res) => {
      const id = req.params.id;
      const filter= {_id: new ObjectId(id)};
      const options = { upsert: true};
      const updatedArt = req.body;
      console.log(updatedArt)

      const art = {
        $set : {
          image: updatedArt.image,
          item_name : updatedArt.item_name,
          subcategory_name : updatedArt.subcategory_name,
          price : updatedArt.price,
          rating : updatedArt.rating,
          customization : updatedArt.customization,
          processing_time : updatedArt.processing_time,
          stockStatus : updatedArt.stockStatus,
          short_description : updatedArt.short_description,
        }
      }
      const result = await artCollection.updateOne(filter,art,options);
      res.send(result)
    });

    app.get('/subCategories', async(req, res) => {
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    
    app.get('/subCategories/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = {_id : new ObjectId(id)};
      const result = await dataCollection.findOne(query);
      res.send(result)
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb database end


// root api start
app.get('/',(req, res) => {
    res.send('Art-Avero Is Running Perfectly')
});
// root api end

app.listen(port, () => {
    console.log(`Art-Avero Is Running Perfectly On Port : ${port}`)
});