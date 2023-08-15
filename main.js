/**
 * Image Displayer
 * Asaf Gilboa
 */


let requestPage = 1;
let searchText = '';
let selectedCategory = 'all';
let selectedColors = 'all';
let selectedOrientation = 'all';
let modalOpen = false;
let imagesArray = [];
let favorites = {};
const CACHE_EXPIRY = 600000;


/**
 * Create the "option" elements for the image search filters,
 * values are in accordance to Pixabay API.
 */
function populateFilters() {
    const imageCategories = [
        "Backgrounds", "Fashion", "Nature", "Science", "Education",
        "Feelings", "Health", "People", "Religion", "Places", "Animals",
        "Industry", "Computer", "Food", "Sports", "Transportation",
        "Travel", "Buildings", "Business", "Music"
    ];
    const imageColors = [
        "Grayscale", "Transparent", "Red", "Orange",
        "yellow", "Green", "Turquoise", "Blue", "Lilac",
        "Pink", "White", "Gray", "Black", "Brown"
    ];
    const imageOrientations = ["Horizontal", "Vertical"];

    let dropdown = document.getElementById('categoryFilter');
    imageCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        dropdown.appendChild(option);
    });
    dropdown = document.getElementById('colorsFilter');
    imageColors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.toLowerCase();
        option.textContent = color;
        dropdown.appendChild(option);
    });
    dropdown = document.getElementById('orientationFilter');
    imageOrientations.forEach(orientation => {
        const option = document.createElement('option');
        option.value = orientation.toLowerCase();
        option.textContent = orientation;
        dropdown.appendChild(option);
    });
}

/**
 * Receives an array of image objects as they are received from the Pixabay request,
 * and fills a grid on the html page.
 */
function populateGrid(images) {
    try {
        for (i in images) {
            imagesArray.push(images[i]);
            let favorited = (images[i].id in favorites);

            const imgElement =
                `<div class="imageWrapper">
                    <img src="${images[i].webformatURL}" alt="searched image" 
                        onclick='imageClick(this)' alt="${images[i].tags}"
                        class="imageCard" id="image_${imagesArray.length - 1}" >
                    <span class="imgTooltip" id="tooltip_${imagesArray.length - 1}">
                        Tags: <br> ${images[i].tags}
                        <br> - - - <br>
                        Likes: ${images[i].likes}
                        <br> - - - <br>
                        Views: ${images[i].views}
                    </span>
                    <span class="favBtn ${favorited ? 'favorited' : ''}" 
                        id="fav_${imagesArray.length - 1}"
                        onclick='favClick(this)'>
                        &#10084;
                    </span>
                </div>`;
            document.getElementById("imageGrid").innerHTML += imgElement;
        }
    } catch (error) {
        console.error("populateGrid error: ", error.message);
    }
    loadingOn(false);
}

/**
 * Fetches random images.
 */
function getRandomImages() {
    try {
        const fetchString = `http://localhost:3000/images/random`;
        fetch(fetchString)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("imageGrid").innerHTML = '';
                populateGrid(data);
            });
    } catch (error) {
        console.error("getRandomImages error: ", error.message);
    }
}

/**
 * Fetches images according to the search parameters.
 */
function fetchImagesByTags() {
    try {
        const searchParams = {
            searchText: searchText,
            selectedCategory: selectedCategory,
            selectedColors: selectedColors,
            selectedOrientation: selectedOrientation,
            requestPage: requestPage
        }
        const fetchString =
            `http://localhost:3000/images/`;
        fetch(fetchString, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(searchParams),
        }).then((response) => response.json())
            .then((data) => {
                if (data.length < 20) {
                    document.getElementById("moreImagesBtn").style.display = "none";
                    if (data.length === 0) {
                        if (requestPage === 1) {
                            const noResMessage =
                                `<span class='noResMessage'>No Results found</span>`;
                            document.getElementById("message").style.display = "block";
                            document.getElementById("message").innerHTML = noResMessage;
                            loadingOn(false);
                        }
                        return;
                    }
                }
                addToCache(data);
                populateGrid(data);
                requestPage++;
            });
    } catch (error) {
        console.error("fetchImagesByTags error: ", error.message);
    }
}

/**
 * Event for prompting an image search.
 * Gets the search parameters and prepares the page to present the image grid.
 */
function imageSearchClick(e) {
    e.preventDefault();
    searchText = document.getElementById("imageSearchBox").value.replace(/\s/g, '+');
    selectedCategory = document.getElementById("categoryFilter").value;
    selectedColors = document.getElementById('colorsFilter').value;
    selectedOrientation = document.getElementById('orientationFilter').value;
    if (!searchText && (selectedCategory === 'all')) {
        document.getElementById("errorMessage").style.visibility = "visible";
        return;
    };
    loadingOn(true);
    document.getElementById("errorMessage").style.visibility = "hidden";
    document.getElementById("message").style.display = "none";
    document.getElementById("message").innerHTML = '';
    document.getElementById("imageGrid").innerHTML = '';
    document.getElementById("moreImagesBtn").style.display = "none";
    document.getElementById('showFavorites').innerHTML = "Favorites";
    imagesArray = [];
    requestPage = 1;
    const cacheData = getFromCache();
    if (cacheData) {
        populateGrid(cacheData);
    } else {
        fetchImagesByTags();
    }
    document.getElementById("moreImagesBtn").style.display = "block";
}

/**
 * Click event for clicking on an image.
 * Opens a modal with details and a preview of the image.
 */
function imageClick(imgElement) {
    if (modalOpen) return;

    const favElements = document.getElementsByClassName("favBtnModal");
    const xElements = document.getElementsByClassName("closeModalBtn");
    while (favElements.length > 0) {
        favElements[0].parentNode.removeChild(favElements[0]);
        xElements[0].parentNode.removeChild(xElements[0]);
    }

    const imgIndex = Number(imgElement.id.substring(6));
    document.getElementById("pageWrapper").addEventListener('click', handlePageClick);
    document.getElementById("imageModalUI").style.display = "flex";
    document.getElementById("pageWrapper").style.filter = "blur(4px)";

    const xIcon = `<span class="closeModalBtn" onclick='closeModal()'>
                        &#x2716;
                    </span>`
    document.getElementById("imageModalUI").innerHTML += xIcon;
    populateModal(imgIndex);
    setTimeout(() => {
        modalOpen = true;
    }, 0);
}

/**
 * Event for clicking either of the modal's scroll (arrow) buttons.
 * Changes the modal to the next/previous image on the grid.
 */
function modalSlider(element, direction) {
    const sibling = (element.parentElement).children[1].children[0];
    const imgIndex = Number(sibling.name);

    const previousFavIcon = document.getElementById(`modal_fav_${imgIndex}`);
    if (previousFavIcon) {
        previousFavIcon.remove();
    }

    let nextIndex = direction === "right" ? (imgIndex + 1) : (imgIndex - 1);
    if ((imgIndex === 0) && (direction === "left")) {
        nextIndex = imagesArray.length - 1;
    } else if ((imgIndex === imagesArray.length - 1) && (direction === "right")) {
        nextIndex = 0;
    }
    populateModal(nextIndex);
}

/**
 * Create and display the modal element
 */
function populateModal(imageIndex) {
    const {
        webformatURL, likes, views, tags, user, id, largeImageURL
    } = imagesArray[imageIndex];

    document.getElementById("modalImage").name = imageIndex;
    document.getElementById("modalImage").src = webformatURL;

    const favorited = (id in favorites);
    const favIcon =
        `<span class="favBtn favBtnModal ${favorited ? 'favorited' : ''}" 
            id="modal_fav_${imageIndex}" onclick='favClick(this, true)'>
                &#10084;
        </span>`
    document.getElementById("imageModalUI").innerHTML += favIcon;

    const modalDetails =
        `<span class="modalSubheader">
            Tags:<br></span> <span>&nbsp;${tags}
        </span> <br>
        <span class="modalSubheader">Likes:</span> <span>${likes}</span> <br>
        <span class="modalSubheader">Views:</span> <span>${views}</span> <br>
        <span class="modalSubheader">User:</span> <span>${user}</span>
        <br><br>
        <a class="modalSubheader" href="${largeImageURL}" target="_blank">
            See full image
        </a>`;
    document.getElementById("modalDetails").innerHTML = modalDetails;
}

/**
 * Event for clicking an image's "favorites" icon.
 * Either on the grid or on modal.
 * If an image is unfavorited while in favorites "section", it will be instantly removed
 */
function favClick(favElement, fromModal = false) {
    if (modalOpen && !fromModal) return;

    const imgIndex = Number(favElement.id.substring(fromModal ? 10 : 4));
    if (!(imagesArray[imgIndex].id in favorites)) {
        favorites[imagesArray[imgIndex].id] = imagesArray[imgIndex];
        favElement.style.color = "red";

        if (fromModal) {
            const gridImg = "fav_" + document.getElementById(`modalImage`).name;
            document.getElementById(gridImg).style.color = "red";
        }
    } else {
        delete favorites[imagesArray[imgIndex].id];
        favElement.style.color = "lightslategray";

        if (fromModal) {
            let currentModal = document.getElementById(`modalImage`).name;
            currentModal = "fav_" + currentModal;
            document.getElementById(currentModal).style.color = "lightslategray";
        }
        if (document.getElementById('showFavorites').innerHTML !== "Favorites") {
            document.getElementById("imageGrid").innerHTML = '';
            imagesArray = [];
            if (fromModal) closeModal();

            if (Object.keys(favorites).length === 0) {
                const noFavMessage =
                    `<span class='noResMessage'>No image favorited</span>`;
                document.getElementById("message").style.display = "block";
                document.getElementById("message").innerHTML = noFavMessage;
            } else {
                loadingOn(true);
                populateGrid(favorites);
            }
        }
    }
}

/**
 * Event for clicking the "Favorites"/"Back" button.
 * Changes the grid to show favorited images.
 */
function showFavsClick(e) {
    e.preventDefault();
    loadingOn(true);
    try {
        document.getElementById("message").style.display = "none";
        document.getElementById("message").innerHTML = '';
        document.getElementById("imageGrid").innerHTML = '';
        imagesArray = [];

        if (document.getElementById('showFavorites').innerHTML !== "Favorites") {
            backToSearch();
            return;
        }
        document.getElementById('showFavorites').innerHTML = "&#x21fd; Back";
        document.getElementById("moreImagesBtn").style.display = "none";

        if (Object.keys(favorites).length === 0) {
            const noFavMessage =
                `<span class='noResMessage'>No image favorited</span>`;
            document.getElementById("message").style.display = "block";
            document.getElementById("message").innerHTML = noFavMessage;
            loadingOn(false);
        } else {
            populateGrid(favorites);
        }
    } catch (error) {
        console.error("showFavsClick error: ", error.message);
    }
}

/**
 * Changes the grid from favorited images to show the latest search,
 *  or random images if there wasn't one.
 */
function backToSearch() {
    document.getElementById('showFavorites').innerHTML = "Favorites";
    requestPage = 1;
    if (searchText || selectedCategory !== 'all') {
        fetchImagesByTags();
        document.getElementById("moreImagesBtn").style.display = "block";
    } else {
        getRandomImages();
    }
}

/**
 * Event for clicking on the page outside the modal, when modal is up
 */
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


function addToCache(data) {
    try {
        let cacheKey = searchText + requestPage
            + selectedCategory + selectedColors + selectedOrientation;
        cacheKey = cacheKey.replace(/\s/g, '+');
        localStorage.setItem(cacheKey, JSON.stringify(data));
        const newCacheDate = new Date();
        localStorage.setItem('cacheDate', JSON.stringify(newCacheDate));
        setTimeout(() => {
            localStorage.removeItem(cacheKey);
        }, CACHE_EXPIRY);
    } catch (error) {
        console.error("addToCache error: ", error.message);
    }
}


function getFromCache() {
    try {
        let cacheKey = searchText + requestPage
            + selectedCategory + selectedColors + selectedOrientation;
        cacheKey = cacheKey.replace(/\s/g, '+');
        const readFromCache = JSON.parse(localStorage.getItem(cacheKey)) || null;
        return readFromCache;
    } catch (error) {
        console.error("getFromCache error: ", error.message);
    }
}

/**
 * Clears the cache if it's been 24 hours since last update.
 * Individual cache entries have a timed removal, so this is a fail-safe.
 */
function cacheClear() {
    try {
        const cacheDate = JSON.parse(localStorage.getItem('cacheDate')) || null;
        if (!cacheDate) return;
        
        const timeDifference = Date.now() - (new Date(cacheDate).getTime());
        const has24HoursPassed = timeDifference >= 86400000;
        if (has24HoursPassed) {
            localStorage.clear();
            const newCacheDate = new Date();
            localStorage.setItem('cacheDate', JSON.stringify(newCacheDate));
        }
    } catch (error) {
        console.error("cacheClear error: ", error.message);
    }
}

/**
 * Handles the spinner-loader, that's displayed during requests and page-loads.
 */
function loadingOn(isOn) {
    if (isOn) {
        document.getElementById('showFavorites').disabled = true;
        document.getElementById('imageSearchClick').disabled = true;
        document.getElementById('imageSearchBox').disabled = true;
        document.getElementById('loader').style.display = "block";
    } else {
        document.getElementById('showFavorites').disabled = false;
        document.getElementById('imageSearchClick').disabled = false;
        document.getElementById('imageSearchBox').disabled = false;
        document.getElementById('loader').style.display = "none";
    }
}


document.getElementById('showFavorites').addEventListener('click', showFavsClick);
document.getElementById('moreImagesBtn').addEventListener('click', fetchImagesByTags);
document.getElementById('imageSearchClick').addEventListener('click', imageSearchClick);
document.addEventListener("DOMContentLoaded", () => {
    cacheClear();
    populateFilters();
    getRandomImages();
});
