import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Gallery from "./components/Gallery";
import AdminPhotoForm from "./components/AdminPhotoForm";
import photoData from "./data/photos.json";
import "./styles/App.css";
import type { PhotoData } from "./types/PhotoData";

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Gallery</Link>
          <Link to="/admin">Add Photo</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Gallery photos={photoData.photos as PhotoData[]} />}
          />
          <Route path="/admin" element={<AdminPhotoForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
