import { NavLink, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";
import logo from "./assets/flavor-nook-logo.png";

function App() {
  return (
    <>
      <header className="site-header">
        <div className="brand">
          <img className="logo-image" src={logo} alt="Flavor Nook" />

          <p className="tagline">Find something worth cooking.</p>
        </div>

        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            List
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Gallery
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/meal/:id" element={<DetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
