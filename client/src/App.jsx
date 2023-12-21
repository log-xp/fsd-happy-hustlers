import axios from "axios";
import { UserContextProvider } from "./assets/UserContext";
import Routes from "./Routes";

function App() {

  axios.defaults.baseURL = 'https://mern-chat-video2-2x7o.vercel.app';
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      < Routes />
    </UserContextProvider>
   
  )
}

export default App
