/**
 * Image Displayer
 * Asaf Gilboa
 * 28/06/2023
 */


// I'm aware this shouldn't be here, 
// for the sake of the exercise I'm avoiding using an env file for now
const API_KEY = '37958354-de46dabfdd71801db390aedd0';

let requestPage = 1;
let searchText = '';
let modalOpen = false;
let imagesArray = [];


function fetchImages() {
    const fetchString = `https://pixabay.com/api/?key=${API_KEY}&q=${searchText}&page=${requestPage}&pretty=true`;
    fetch(fetchString)
        .then((response) => response.json())
        .then((data) => {
            if (data.hits.length < 20) {
                document.getElementById("moreImagesBtn").style.display = "none";
                if (data.hits.length === 0) return;
            }
            for (let i = 0; i < data.hits.length; i++) {
                imagesArray.push(data.hits[i]);
                const imgElement =
                    `<div class="imageWrapper">
                        <img src="${data.hits[i].webformatURL}" alt="searched image" onclick='imgClick(this)' 
                        class="imageCard" id="image_${imagesArray.length - 1}" >
                        <span class="imgTooltip" id="tooltip_${imagesArray.length - 1}">
                        Image tags: <br> ${data.hits[i].tags}
                        <br> - - - <br>
                        By user: ${data.hits[i].user}
                        <br> - - - <br>
                        Likes: ${data.hits[i].likes}
                        </span>
                    </div>`;
                document.getElementById("imageGrid").innerHTML += imgElement;
            }
        });
    requestPage++;
}


document.getElementById('moreImagesBtn').addEventListener('click', fetchImages);
document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
function imageSearchClick(e) {
    e.preventDefault();
    document.getElementById("moreImagesBtn").style.display = "none";
    document.getElementById("imageGrid").innerHTML = '';
    searchText = document.getElementById("imageSearchBox").value;
    imagesArray = [];
    requestPage = 1;
    fetchImages();
    document.getElementById("moreImagesBtn").style.display = "block";
}


function imgClick(imgElement) {
    if (modalOpen) return;
    document.getElementById("pageWrapper").addEventListener('click', handlePageClick);
    document.getElementById("imageModalUI").style.display = "block";
    document.getElementById("modalImage").src = imgElement.src;
    document.getElementById("pageWrapper").style.filter = "blur(4px)";

    // to prevent "outside modal" click events from being triggered simultaneously as image clicks
    setTimeout(() => {
        modalOpen = true;
    }, 0);
    const imgIndex = Number(imgElement.id.substring(6));
    console.log(`imagesArray[${imgIndex}] = `, imagesArray[imgIndex]);
}


function handlePageClick(e) {
    if (!document.getElementById("imageModalUI").contains(e.target)) {
        closeModal();
    }
}


function closeModal() {
    if (!modalOpen) return;
    document.getElementById("pageWrapper").style.filter = "none";
    document.getElementById("imageModalUI").style.display = 'none';
    document.getElementById("pageWrapper").removeEventListener('click', handlePageClick);
    modalOpen = false;
}
