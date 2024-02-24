const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Environment
require('dotenv').config();
const PORT = process.env.PORT

// Connect MongoDB

mongoose.connect(process.env.CONNECT_MONGODB)
    .then(() => {
        console.log('MongoDB connection successfully!')
    }).catch((error) => {
        console.log('something wrong: ', error)
    })

// Models Schema

const apiSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    project_url: String
});

const Api = mongoose.model('Api', apiSchema);

// https://localhost:8080

app.listen(PORT, () => {
    console.log(`Connnecting to server on http://localhost:${PORT}`)
})

// Page Output

app.get("/", (req, res) => {
    res.send('API is runing...')
})

// GET POST PATCH DELETE

app.post("/api", (req, res) => {
    Api.create(req.body).then((api) => {
        res.status(201).send(api);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

app.get("/api", (req, res) => {
    Api.find({}).then((apis) => {
        res.send(apis);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

app.get("/api/:id", (req, res) => {
    Api.findById(req.params.id).then((api) => {
        if (!api) {
            return res.status(404).send();
        }
        res.send(api);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

app.patch("/api/:id", (req, res) => {
    Api.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((api) => {
        if (!api) {
            return res.status(404).send();
        }
        res.send(api);
    }).catch(error => {
        res.status(500).send(error);
    })
})

app.delete("/api/:id", (req, res) => {
    Api.findByIdAndDelete(req.params.id).then(api => {
        if (!api) {
            return res.status(400).send();
        }
        res.send("This id deleted !!!")
    }).catch(error => {
        res.status(500).send(error)
    })
})