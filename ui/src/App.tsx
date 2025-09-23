import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./services/socketProvider";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Room from "./pages/Room";

function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;