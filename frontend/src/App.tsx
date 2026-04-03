import { Routes, Route, Navigate } from "react-router-dom";
import LayoutPrincipal from "./layouts/layout";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import Aposta from "./pages/aposta";
import ComoJogar from "./pages/comoJogar";
import Historico from "./pages/historico";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<LayoutPrincipal />}>
        <Route path="/aposta" element={<Aposta />} />
        <Route path="/historico" element={<Historico/>}/>
        <Route path="/como-jogar" element={<ComoJogar />} />
        
       
      </Route>
    </Routes>
  );
}