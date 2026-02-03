import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProveedorCapturados } from "./context/CapturedContext";

import LandingPage  from "./pages/LandingPage";
import PokedexPage  from "./pages/PokedexPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import CapturedPage from "./pages/CapturedPage";
import NotFoundPage from "./pages/NotFound";


function App() {

  return (
    <ProveedorCapturados>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pokedexPage" element={<PokedexPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/capturados" element={<CapturedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ProveedorCapturados>

  )
}

export default App
