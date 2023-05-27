import React, { useState } from 'react';
// Librerias necesarias para usar react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importacion de hoja de estilos
import './App.css';

// Importacion de componentes
import { logoBase64 } from './componentes/Banner/ImagenBase64';
import { Inicio } from './componentes/PaginaPrincipal/Inicio'
import Banner from './componentes/Banner/Banner';
import PaginaPeliculas from './componentes/FiltrosBusqueda/PaginaPeliculas';
import BusquedaBarra from './componentes/BarraBusqueda/BusquedaBarra';
import Resultados from './componentes/BarraBusqueda/ResultadosBusqueda';
import VentanaLogin from './componentes/Login/VentanaLogin';
import ListaSeguimiento from './componentes/ListaSeguimiento/ListaSeguimiento';
import PorMirar from './componentes/PorVer/PorMirar';


// Librerias para la creacion de rutas
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route
} from "react-router-dom";

// Importacion de herramientas de bootstrap
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import RegistroUsuario from './componentes/Login/RegistroUsuario';




function App() {

  const logo = logoBase64;

  // Estado para el inicio de sesion
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              <img
                src={`data:image/png;base64, ${logo}`}
                alt="Logo"
              />
            </Navbar.Brand>
            <BusquedaBarra />
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-5 flex-grow-1">
                <Nav.Link as={Link} to="/">
                  Inicio
                </Nav.Link>
                <Nav.Link as={Link} to="/peliculas">
                  Películas
                </Nav.Link>
                {isLoggedIn ? (
                  <NavDropdown title='Mi cuenta' id="basic-nav-dropdown" className='border'>
                    <NavDropdown.Item as={Link} to="/configuracion">Configuración</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/notificaciones">Notificaciones</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/lista-seguimiento">Favoritos</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/peliculas-ver">Películas por ver</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/guardar-caracteres">Guardar caracteres</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link>
                    <VentanaLogin onLogin={handleLogin} onLogout={handleLogout} />
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/comunidad">
                  Comunidad
                </Nav.Link>
                <Nav.Link as={Link} to="/sobre-nosotros">
                  Acerca de
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      {/* Contenedor de las rutas */}
      <div className='container mt-5'>
        <Routes>
          <Route exact path="/" element={<Inicio />} />
          <Route exact path="/peliculas" element={<PaginaPeliculas />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/lista-seguimiento" element={<ListaSeguimiento />} />
          <Route path="/peliculas-ver" element={<PorMirar />} />
          {/* {isLoggedIn && (
            <Route path="/guardar-caracteres" element={<GuardarCaracteres />} />
          )} */}
        </Routes>

      </div>
      {/* Contenedor del banner */}
      <div className='container mt-5'>
        <Banner />
      </div>
    </Router>
  );
}


export default App;
