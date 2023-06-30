/**
 * Image Displayer
 * Asaf Gilboa
 * 30/06/2023
 */

require("dotenv").config();
const API_KEY = process.env.API_KEY;

async function getImagesByTag(req, res) {
    try {
        const {searchText, requestPage} = req.params;
        // console.log("params: ", searchText, requestPage, API_KEY);
        const fetchString = `https://pixabay.com/api/?key=${API_KEY}&q=${searchText}&page=${requestPage}&pretty=true`;
        const response = await fetch(fetchString);
        const data = await response.json();
        res.send( data.hits );
    } catch (error) {
        console.error("getImagesByTag error: ", error.message);
        res.status(500).send(error);
    }
}


module.exports = {
    getImagesByTag
};
