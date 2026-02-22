import '../App.css'

import ExploreGenres from '../pages/ExploreGeneres'
import Home from '../pages/home'
import NotFound from '../pages/NotFound'
import PlaylistPage from '../pages/PlaylistPage'
import ProfilePage from '../pages/ProfilePage'
import SharePage from '../pages/SharePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  

  return (
   <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path='/explore' element={<ExploreGenres genres={["Pop", "Rock", "Hip-Hop", "Electronic"]} />} />
        <Route path="/playlist" element={<PlaylistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/share" element={<SharePage />} />
      </Routes>
      <NotFound></NotFound>
    </Router>
    
  )
}

export default App
