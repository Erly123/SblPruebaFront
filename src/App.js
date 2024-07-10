import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Configuracion from './components/Configuracion';
import Libros from './components/libros';
import Banco from './components/Banco';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/libros" element={<Libros/>} />
                <Route path="/Banco" element={<Banco/>} />
            </Routes>
        </Router>
    );
}

export default App;
