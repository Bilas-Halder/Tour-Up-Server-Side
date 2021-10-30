const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s0vtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const uri = process.env.DB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("TourUp");
        const placeCollection = database.collection("places");
        const bannerPlaceCollection = database.collection("banner-places");


        // Get API
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.json(places);
        });

        // Get API for banners
        app.get('/banner/places', async (req, res) => {
            const cursor = bannerPlaceCollection.find({});
            const places = await cursor.toArray();
            res.json(places);
        });

        // Get single place API
        app.get('/places/:id', async (req, res) => {
            const id = req.params?.id;
            const query = { _id: ObjectID(id) };

            const place = await placeCollection.findOne(query);
            res.json(place);
        });

        // DELETE API
        app.delete('/places/:id', async (req, res) => {
            const id = req.params?.id;
            const query = { _id: ObjectID(id) };
            const result = await placeCollection.deleteOne(query);

            // console.log('delete result', result);
            res.json(result);
        })

        //Post API
        app.post('/places', async (req, res) => {
            const newPlace = req.body;
            const result = await placeCollection.insertOne(newPlace);

            // console.log('Got new place', req.body);
            // console.log('Adding to db by post API', result);
            res.json(newPlace);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})