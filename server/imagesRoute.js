/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

const express = require('express');
const router = express.Router();

const { getImagesByTag } = require("./imagesController");


router.get("/:searchQuery", getImagesByTag);


module.exports = router;
