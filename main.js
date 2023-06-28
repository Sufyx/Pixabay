/**
 * Image Displayer
 * Asaf Gilboa
 * 28/06/2023
 */


const API_KEY = '37958354-de46dabfdd71801db390aedd0';


document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
function imageSearchClick(e) {
    e.preventDefault();
    const searchText = document.getElementById("imageSearchBox").value;
    // console.log("search text: ", searchText);
    const fetchString = `https://pixabay.com/api/?key=${API_KEY}&q=${searchText}&pretty=true`;
    fetch(fetchString)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    });
}