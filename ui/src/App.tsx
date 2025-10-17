import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./services/socketProvider";
import { Preloads } from "./utils/preloads";
import Home from "./Pages/Home";
import Create from "./Pages/Create";
import Room from "./Pages/Room";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";
import Loading from "./components/Loading";

function App() {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function preload() {
            try {
                await Preloads.preloadAll();
            } catch (err) {
                console.error("Erro ao pré-carregar assets:", err);
            } finally {
                setLoading(false);
            }
        }
        preload();
    }, []);

    if (loading) return <Loading />
  
    return (
        <Router>
            <SocketProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/lobby/:room_id" element={<Lobby />} />
                    <Route path="/game/:room_id" element={<Game />} />
                </Routes>
            </SocketProvider>
        </Router>
    );
}

export default App;