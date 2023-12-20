import axios from "axios";
import { UserContextProvider } from "./assets/UserContext";
import Routes from "./Routes1";

function App() {

  axios.defaults.baseURL = 'http://localhost:4040';
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      < Routes />
    </UserContextProvider>
   
  )
}

export default App
