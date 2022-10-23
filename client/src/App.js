import './App.css';
import { useEffect } from "react";
// import { useQuery } from '@apollo/client';
import Home from './components/Home';
import { getTodaysEvents } from './utils/scrapers';
// import axios from "axios";
// const cheerio = require('cheerio');



function App() {

  // const url = 'https://www.austinchronicle.com/events/music/2022-10-21/'

  // // useEffect(() => {
  //   axios(url)
  //       .then(response => {
  //           const html = response.data
  //           const $ = cheerio.load(html)
  //           const events = [];
  //           $('.list-item', html).each(function() {
  //               const artists = $(this).find('h2').text()
  //               const description = $(this).find('.description').text()
  //               const dateTime = $(this).find('.date-time').text()
  //               const venue = $(this).find('.venue').text()
  //               events.push({
  //                   artists,
  //                   description,
  //                   dateTime,
  //                   venue
  //               })
  //           })
  //           console.log('events scraper!!!!!');
  //           console.log(events);
  //           return events;
  //       }).catch(err => console.log(err));
  // // })
  const { loading, data: myData } = getTodaysEvents();
  useEffect(() => {
    if(!loading) {
      console.log('myData!!!!!!!!!!');
      console.log(myData);
    }
  })

  return (
    <div>
      <Home></Home>
      
    </div>
  );
}

export default App;
