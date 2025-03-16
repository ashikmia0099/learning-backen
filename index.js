const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware set

app.use(cors({origin:['http://localhost:5173','https://learn-langauge.web.app']}));
app.use(express.json());



// mongoDB Data Base




// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkw47.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkw47.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    await client.connect();

    const LangaugesCollection = client.db('Learn_Langauge').collection('Langauges');
    const selectedTutorCollection = client.db('Learn_Langauge').collection('selected_Tutor');

    // get learn langauge data


    app.get('/langauges', async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const allLanguages = LangaugesCollection.find(query);
      const result = await allLanguages.toArray();
      res.send(result);
    });




    // post learn data


    app.post('/langauges', async (req, res) => {
      const newLangauge = req.body;
      const result = await LangaugesCollection.insertOne(newLangauge)
      res.send(result);
    })

    app.get('/langauges/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await LangaugesCollection.findOne(query);
      res.send(result);
    })


    // delete my posted tuturials

    app.delete('/langauges/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await LangaugesCollection.deleteOne(query);
      res.send(result);
    })



    // update tuturial




    app.put('/langauges/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTutorDoc = req.body;

      // akhane update turor doc a data set kora holo

      const TutorDoc = {
        $set: {
          language: updatedTutorDoc.language,
          country: updatedTutorDoc.country,
          description: updatedTutorDoc.description,
          price: updatedTutorDoc.price,
          image: updatedTutorDoc.image,
        },
      };

      const result = await LangaugesCollection.updateOne(filter, TutorDoc, options);
      res.send(result);
    });




    // add tutor from details page

    app.post('/selected_tutor', async (req, res) => {

      const tutorData = req.body;
      const result = await selectedTutorCollection.insertOne(tutorData);
      res.send(result)

    })


    // get tutor data on my booked tutor page

    app.get('/selected_tutor', async (req, res) => {
      const email = req.query.Email;
      let query = {};
      if (email) {
        query = { Email: email };
      }
      const selectedAllTutor = selectedTutorCollection.find(query);
      const result = await selectedAllTutor.toArray();
      res.send(result);
    })


    // review tutor data


    app.patch('/review/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      // akhane review add kore hoice
      
      const updatedDoc = {
        $inc: { status: 1 },
      };

      const result = await LangaugesCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });








    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Sarber Successfully Running')
})


app.listen(port, () => {
  console.log(`Server is running is port ${port}`)
})

