import "./App.css";
import Home from "./components/Home";
import logo from "./img/marvel-logo.png";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CharactersList from "./components/CharactersList";
import ComicsList from "./components/ComicsList";
import Characters from "./components/Characters";
import Comics from "./components/Comics";
import SeriesList from "./components/SeriesList";
import Series from "./components/Series";
import Error from "./components/Error";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div className="center">
              <img src={logo} alt=""></img>
            </div>
          </div>
          <h1 className="App-title">
            Welcome to the React.js Marvel API Example
          </h1>
          <div className="header-links">
            <Link className="showlink" to="/characters/page/0">
              Characters
            </Link>
            <Link className="showlink" to="/comics/page/0">
              Comics
            </Link>
            <Link className="showlink" to="/series/page/0">
              Series
            </Link>
          </div>
        </header>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters/page/:page" element={<CharactersList />} />
            <Route path="/characters/:id" element={<Characters />} />
            <Route path="/comics/page/:page" element={<ComicsList />} />
            <Route path="/comics/:id" element={<Comics />} />
            <Route path="/series/page/:page" element={<SeriesList />} />
            <Route path="/series/:id" element={<Series />} />
            <Route path="*" element={<Error />} status={404} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
