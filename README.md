![NPM](https://img.shields.io/npm/l/express) ![npm](https://img.shields.io/npm/v/npm) ![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-green)

# Employee manager
## Table of contents
  1.[Description](#Description)

  2.[Deployed application link](#Deployed-application-link)

  3.[Installation](#Installation)

  4.[Usage](#Usage)

  5.[Screenshots or video](#Screenshots-or-video)

  6.[Credits](#Credits)

  7.[License](#License)
## Description 
  This repository contains all the required code for the node application employee manager to work.
## Installation
  To run this application the user must first start download the entire repository either as a zip file or as a clone. Once that is done, then the user on their console must locate their files on their console. Next, on the console the user must type 'npm install' to download all the dependencies.

  Next, the user must start the database. To start the database, the user can use the provided sql file located within the repository. NOTE: FOR THE NEXT STEPS THE MYSQL IS REQUIERED. On mySql or on the console, the user should just copy and paste the code of the sql file into the console or mysql and run it. Check the videos for a visual tutorial on how to start the database.
  
  Lastly, make sure that to write the password of your database inside the const connectionParam.
## Usage
  Follow the next steps to run the app:
    1. Type npm start on the console.
    2. Select what you would like to do with the app.
    3. If done using the app, select EXIT to close the app.
    NOTE: if at any moment you need to restart the app press control C to stop the app, then type npm start to start again.
## Weaknesses
  One of the weaknesses for this app arises when adding and updating managers, because it forces the user to type the word manager on the role title. More work is required to overcome this problem, maybe like creating a table on the database only for managers.
## Screenshots or video
    Screenshot of the App on the console:
  ![App](https://i.imgur.com/E0BpFIF.png)
  Video of the application in use: https://www.youtube.com/watch?v=XAS5vo1rF9Q&feature=youtu.be
  
  Video of how to install the app: https://www.youtube.com/watch?v=BC9X-3hdqU0&feature=youtu.be
## Credits
  Made by: Jhonny Lin (Github: Jlin72 https://github.com/Jlin72)
## License
  MIT License
