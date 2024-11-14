import React, { useState, useEffect } from 'react';
import SongsTable from './components/SongsTable';
import { fetchSongs } from './api/songsApi';

const App = () => {
   const [songs, setSongs] = useState([]);

   useEffect(() => {
       const loadSongs = async () => {
           const response = await fetchSongs();
           setSongs(response.data.data);
       };
       loadSongs();
   }, []);

   return (
       <div>
            <h1></h1>
            <SongsTable />
       </div>
   );
};

export default App;


