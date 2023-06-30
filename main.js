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
let favorites = {};


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
                let favorited = (data.hits[i].id in favorites);
                const imgElement =
                    `<div class="imageWrapper">
                        <img src="${data.hits[i].webformatURL}" alt="searched image" 
                        onclick='imgClick(this)' 
                        class="imageCard" id="image_${imagesArray.length - 1}" >

                        <span class="imgTooltip" id="tooltip_${imagesArray.length - 1}">
                        Tags: <br> ${data.hits[i].tags}
                        <br> - - - <br>
                        User: ${data.hits[i].user}
                        <br> - - - <br>
                        Likes: ${data.hits[i].likes}
                        </span>

                        <span class="favBtn ${favorited ? 'favorited' : ''}" 
                            id="fav_${imagesArray.length - 1}"
                            onclick='favClick(this)'>
                            &#10084;
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
    setTimeout(() => {
        modalOpen = true;
    }, 0);
}



// document.getElementById('showFavorites').addEventListener('click', showFavsClick);
// function showFavsClick(e) {
//     e.preventDefault();

// }

function favClick(favElement) {
    if (modalOpen) return;
    const imgIndex = Number(favElement.id.substring(4));
    if (!(imagesArray[imgIndex].id in favorites)) {
        favorites[imagesArray[imgIndex].id] = imagesArray[imgIndex];
        favElement.style.color = "red";
    } else {
        delete favorites[imagesArray[imgIndex].id];
        favElement.style.color = "lightslategray";
    }
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
