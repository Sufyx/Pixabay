/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

require("dotenv").config();
const API_KEY = process.env.API_KEY;

async function getImagesByTag(req, res) {
    try {
        const {searchQuery} = req.params;

    } catch (error) {
        console.error("getImagesByTag error: ", error.message);
        res.status(500).send(error);
    }
}


module.exports = {
    getImagesByTag
};
