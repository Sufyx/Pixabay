/**
 * Image Displayer
 * Asaf Gilboa
 */

const express = require('express');
const router = express.Router();

const { getImagesByTag, getRandomImages } = require("./imagesController").default;
const { createFetchString } = require("./middleware").default;

router.post("/", createFetchString, getImagesByTag);
router.get("/random", getRandomImages);


module.exports = router;
