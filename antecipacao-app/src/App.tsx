import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import EmpresaPage from "@/pages/empresas";
import NotasPage from "@/pages/notas";
import CarrinhoPage from "./pages/carrinho";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<EmpresaPage />} path="/empresas" />
      <Route element={<NotasPage />} path="/notas" />
      <Route element={<CarrinhoPage />} path="/carrinho" />
    </Routes>
  );
}

export default App;
