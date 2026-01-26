import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*EL BROWSER ROUTER CONECTA LA BARRA DE DIRECCIONES DEL NAVEGAODR CON EL CODIGO*/}
    <BrowserRouter>
      {/* EL APPPROVIDER DA ACCESO A LOS DATOS GLOBALES EN TODA LA APP */}
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
