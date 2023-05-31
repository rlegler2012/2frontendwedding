import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap'; 
import { Routes, Route } from "react-router-dom";
import About from './pages/About';
import MusicRequest from './pages/MusicRequest';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import { useEffect, useState } from "react"


//Spotify API 
const CLIENT_ID = "c6fcb70c537e4e0fb9d2abc04f915468";
const CLIENT_SECRET = "0a94f0a8f2e243e486bdaadd01465370";

function App() {
 const [ locateInput, setLocateInput] = useState([]);
 //now i want to save the token in a string using useState
 const [ accessToken, setAccessToken] = useState([]);
 const [ albums , setAlbums] = useState ([])
 const [ tracks, setSongRequest ] = useState([])
 //spotify requires access API tokens - will use fetch //got this from spotify documentation --- spotify requires strict code implementation when using things like method, auth, etc - got from documentation and help from multiple youTube resources https://www.youtube.com/watch?v=fVcz-1rVQcs to help implement https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 useEffect(() => {
  let authorization = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
  }
    fetch('https://accounts.spotify.com/api/token', authorization)
    .then(result => 
      result.json())
    //console.log data to find out what data is coming and what ID it's named.. the string is named access_token
    // .then(data => console.log(data.access_token))
    .then(data => 
      setAccessToken(data.access_token))
 }, [])

 //search through spotify using async because i want each function to wait its turn
 async function search () {
  // console.log("search" + locateInput)

  //Get request using search to get the Artist ID
    let searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    let artistID = await fetch('https://api.spotify.com/v1/search?q=' + locateInput + '&type=artist', searchParams)
      .then(response => 
        response.json())
      // .then(data => console.log(data)) 
      //this console.log revealed that spotify implemented where when i searched for an artist it listed the top 18 artist closest to that name into 'artist' then 'items' with 18 arrays within that.. to help condense this i am going to grab only the most popular (top) array item (which would be array at index 0) and then access the artist with 'id' as spotify has it labeled
      .then(data => {
        return data.artists.items[0].id
      })
      // console.log("this is artistID" + artistID)
  //Get request w/ Artist ID, grab all the albums from that artist
      let albumsFetched = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParams)
      .then(response =>
        response.json())
      .then(data => {
        // console.log(data);
        setAlbums(data.items)
      })
  //Display those albums to the user
 }

  return (
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Home tracks={tracks} setSongRequest={setSongRequest} />} />
          <Route path="/about" element={<About />} />
          <Route path="/musicrequest" element={ <MusicRequest tracks={tracks} setSongRequest={setSongRequest} /> } />
        </Routes>
          <Container>
            <InputGroup className="mb-3" size="lg">
              <FormControl 
                placeholder="Search for Artist to find albums"
                type="input"
                onKeyDown={event => {
                  if (event.key == "Enter") {
                    // console.log("Pressed enter")
                    search()
                  }
                }}
                //onChange is an event.. capture the event with 'event' and create function to use 'target' (aka FormControl) to change the value
                onChange={event => setLocateInput(event.target.value)}
              />
              <Button onClick={search}>
                Search
              </Button>
            </InputGroup>
          </Container>
          <Container>
            <Row className="mx-2 row row-cols-4">
              {albums.map((album, idx) => {
                console.log(album)
                return (
                <Card>
                  <Card.Img src={album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                  </Card.Body>
                </Card>
                )
              })}
            </Row>
          </Container>
      <Footer />
    </div>
  )
}



export default App;

// Spotify documentation https://developer.spotify.com/documentation/web-api/reference/search

//bootstrap documentation https://react-bootstrap.github.io/getting-started/introduction/
//Responsive 'Containers' allow you to specify a class that is 100% wide until the specified breakpoint is reached, after which we apply max-widths for each of the higher breakpoints ... 'Input Group' Easily extend form controls by adding text, buttons, or button groups on either side of textual inputs, custom selects, and custom file inputs... 'Form Controls' Give textual form controls like <input>s and <textarea>s an upgrade with custom styles, sizing, focus states, and more... 'Row'lets you specify column widths across 6 breakpoint sizes (xs, sm, md, lg, xl and xxl). For every breakpoint, you can specify the amount of columns that will fit next to each other... 'Card' provides a flexible and extensible content container with multiple variants and options.