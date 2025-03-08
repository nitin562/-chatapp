import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import ContextProvider from "./Utils/Context/Global";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
function App() {
 
  return (
    <BrowserRouter>

        <ContextProvider>
          <Home />
        </ContextProvider>
  
    </BrowserRouter>
  );
}

export default App;
