import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './app.css'
import axios from 'axios';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VenuePage from "./pages/VenuePage";
import VenueListPage from "./pages/VenueListPage";
import VenueDetailPage from './pages/VenueDetailPage';  
import Header from "./Header";
import Selector from "./Selector";
import Layout from "./Layout";
import baseUrl from "./backend";
import FirstPage from "./pages/FirstPage";
import EventsPage from "./pages/EventsPage";
import ApplicationsPage from "./pages/ApplicationsPage";



//axios.defaults.baseURL = process.env.BASE_URL + `:` + process.env.BACKEND_PORT;
axios.defaults.baseURL = "http://127.0.0.1:4000";


function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<FirstPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/venue/list" element={<VenueListPage />} />
        <Route path="/venue/:bookName" element={<VenueDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        
    
    
      
     
        <Route path="/applications" element={<Selector><ApplicationsPage /></Selector>} />
        <Route path="/venue" element={<Selector><VenuePage /></Selector>} />
      </Routes>
    </Router>
  );
}

export default App;
