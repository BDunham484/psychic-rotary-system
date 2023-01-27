# <h1 align="center">NOISEBX</h1>

<h2 align="center">🎸🎹Local Concert Listing React App🎹🎸</h2>

## Technologies Used 💻

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=plastic&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=plastic&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=plastic&logo=javascript&logoColor=%23F7DF1E)
![Git](https://img.shields.io/badge/-Git-F05032?style=plastic&logo=Git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=plastic&logo=github&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=plastic&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/-npm-%23323330?style=plastic&logo=npm&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=plastic&logo=react&logoColor=%2361DAFB)
![ReactRouter](https://img.shields.io/badge/react%20router-%2320232a.svg?style=plastic&logo=react%20router&logoColor=#CA4245)
![JSX](https://img.shields.io/badge/JSX-F9DC3e.svg?style=plastic&logo=react&logoColor=purple)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=plastic&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/6.5.4-Mongoose-%23800000?style=plastic)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=plastic&logo=express&logoColor=%2361DAFB)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=plastic&logo=apollo-graphql)
![JWT](https://img.shields.io/badge/JWT-black?style=plastic&logo=JSON%20web%20tokens)
![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white?style=plastic)
![Cheerio](https://img.shields.io/badge/1.0.0/rc.12-cheerio-F9DC3e?style=plastic)

![nbx](./client/assets/images/loading-screenshot.png)

## Description

* A Single Page React App that scrapes local concert listings from free to use information websites and displays them depending on the day selected. 

![noisebx-home](https://user-images.githubusercontent.com/40290683/215203917-ce209e10-93f8-4ea3-bb22-11c970a92012.gif)

* When a user is logged in, they then have the ability to save a concert to their profile. 

![noisebx-login](https://user-images.githubusercontent.com/40290683/215205316-94df0ca4-29bc-46d8-88a8-a0d5d39d7724.gif)


![nbx](./client/assets/images/home-loggedIn.png)

* When a show is clicked on from the homepage the user is taken to a page that displays full details about the show.  The ability to see the venue location via google maps, add it to google calendar, and other details will be added soon. 

![nbx](./client/assets/images/show-loggedOut.png)

*  The option to RSVP yes, no, or maybe and add/remove the show from the user's profile is available if logged in.  The number of RSVP's are tallied and the number is displayed allowing users to have some expectations about attendance.

![nbx](./client/assets/images/show-loggedIn.png)

* On the profile page the user is shown a list of their saved shows as well as their friend and pending friend request list. If you know your potential friends username you can enter it into the input and send off a friend request.  The request is then added to your pending request: sent list and to the other users pending request: received list.  You have the option of cancelling the request while the other user has the options of accepting or denying the request.  Once cancelled or denied the request is removed from each list.  If approved, both user are added to each others friend list.  They then have access to each others profiles. 

![F4E](https://user-images.githubusercontent.com/40290683/215193902-e28dbee4-c712-46fb-bb7b-734db3f99e34.gif)


## Local Development

* Run `npm init -y` from the command line<br>
* Run `npm i` to install dependencies

## Usage

* Run `mongod` from the command line
* Run `npm run develop` from the command line

## Deployment

* Be advised, mobile responsivness is currently under development
* Deployed to Heroku [here](https://whispering-retreat-35925.herokuapp.com/)

### Made with ❤️ by  Brad Dunham
