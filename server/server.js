/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

const express = require('express');
require("dotenv").config();
const cors = require("cors");


const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

app.get('/', (req, res) => {
    try {
        res.send( " :) ");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
