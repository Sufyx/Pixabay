/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

const express = require('express');
require("dotenv").config();
const cors = require("cors");
const path = require('path');
const imagesRoute = require("./imagesRoute");

const PORT = process.env.PORT;
const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

// app.use("/images", imagesRoute);

app.use(express.static(path.join(__dirname, '../')));
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../index.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
