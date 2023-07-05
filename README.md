
# Image Displayer

This task is the first project for Startline's post-graduation program for full-stack developers.
It uses (almost) entirely vanilla HTML, CSS and Javascript, with the exception of "Express", "dotenv" and "cors" npms.

To run the project:
- Make sure you have Node version 18 and up installed
- Clone the code to your pc
- Open a terminal in the project root folder and run "npm install"
- Open a terminal in the "server" folder and run "node server.js"
- Open a browser at http://localhost:3000/
---
### Task description:
In this task you will need to call the Pixabay API, [https://pixabay.com/api/docs/](https://pixabay.com/api/docs/) to get images data and display it for the user. The task will have steps, so you will need to complete each step and only after it is done will you move to execute the next step. It is better to have less features work correctly than not working fully.

### Step 1 – Setups

#### Create a GIT repo in GitHub and set it up in your computer.

-   Make sure each step of the task is separated by one, or more, commits.
-   The commits will help us to evaluate your improvement level during the program.
    

#### Setup your API account

1.  Goto [https://pixabay.com/api/docs/](https://pixabay.com/api/docs/) and create an account or login.
2.  Scroll to the section “Search Images”, copy from the example the URL with your api key and run it in the browser to see the items.
3.  There are lots of parameters for searching images, play with them in the browser URL.
    
#### Setup basic HTML page

In this phase we don’t have a Node.JS server, so we will use an HTML page. You will create a simple Live Server package to have your page served in [http://localhost:3000](http://localhost:3000).

### Step 2 – UI search images page basic features

1.  Search box and button. When the user writes something to search and click the button an API call will return the data.
2.  A UI to display all the images using a card per image. You may use online design or create it by yourself.
3.  Click on an image will show the item details by opening a floating box (Modal).
4.  “More Images” button in the bottom of the images list, which will load and display more content. 
5.  The page needs to be responsive to different screen sizes (mobile and desktop).    

### Step 3 – UI Additional features

1.  Hovering on each image, using a mouse, with an effect.
2.  Hovering will show more data on the image.
3.  Have a Favorite icon, on the image card, to save the image for later in favorites.
4.  Adding predefined Tags for filter images (Ex. Background, Wall Paper, Natural ….)

### Step 4 – Backend
Note: please do this step only after you complete the previous steps.

In this step we will move all the API calls to be executed by the Node.JS backend, so each client will contact this server without exposing API keys and other private data. This will also allow us to create more personal experience using accounts etc.

1.  Create node.js backend using express with routes.
2.  Deliver the HTML page content from your server.
3.  Add route for doing the Search API call. At [Step 2](https://docs.google.com/document/d/18qVI37kWTV0y-zPBQ458rFPEZEF-Gvp-C9OXnZAuWmo/edit#heading=h.tiuus33220re) it was done by the client contact directly to the Pixabay API, but we want it now to do it from your server.
4.  Add route for random images loaded when no search phrase is entered. This is the first time a user comes to the page and wants to see something, without even doing a search.
5.  You will display this content when the page is loaded.
6.  To save API calls to the Pixabay API, you can create a simple cache in the Node.JS so it will return the same response if the user gave the same search value.