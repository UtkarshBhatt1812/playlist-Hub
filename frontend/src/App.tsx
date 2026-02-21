import './App.css'
import LoginForm from './components/Signup/Login'
import SignupForm from './components/Signup/Signup'
import ExploreGenres from './pages/ExploreGeneres'
import Home from './pages/home'
import PlaylistPage from './pages/PlaylistPage'
import ProfilePage from './pages/ProfilePage'
import SharePage from './pages/SharePage'
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
      <LoginForm onSubmit={(data) => console.log(data)} />

      <SignupForm  />
    </Router>
    
  )
}

export default App
