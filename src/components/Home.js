import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={NavLink} to="/">Sistema de Gestión de Libros</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/banco">Banco</Nav.Link>
          <Nav.Link as={NavLink} to="/asignacion">Asignación</Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link as={NavLink} to="/configuracion">Configuración</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Home;
