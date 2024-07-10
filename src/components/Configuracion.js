// src/components/Configuracion.js
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const [config, setConfig] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    Id: '',
    period: '',
    start_schol_year: '',
    institute_name: '',
    region: '',
    provincia: '',
    distrito: '',
    modular_code: '',
    phone: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const response = await axios.get('http://localhost:8000/api/sbl_config');
    setConfig(response.data);
  };

  const handleEdit = (item) => {
    setEditing(item.id);  // Asegúrate de que 'id' se pase en minúscula
    setFormData({
      ...formData,
      Id: item.id,  // Asegúrate de que sea 'Id' con mayúscula para coincidir con la API
      period: item.period,
      start_schol_year: item.start_schol_year,
      institute_name: item.institute_name,
      region: item.region,
      provincia: item.provincia,
      distrito: item.distrito,
      modular_code: item.modular_code,
      phone: item.phone,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/sbl_config/${id}`);
    fetchConfig();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editing !== null) {
      await axios.put(`http://localhost:8000/api/sbl_config/${formData.Id}`, formData);
    }

    setEditing(null);
    setFormData({
      Id: '',
      period: '',
      start_schol_year: '',
      institute_name: '',
      region: '',
      provincia: '',
      distrito: '',
      modular_code: '',
      phone: '',
    });
    fetchConfig();
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Sistema de Gestión de Libros</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#">Banco</Nav.Link>
            <Nav.Link href="#">Asignación</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link href="#">Configuración</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container mt-4">
        <h2>Datos Generales</h2>
        <button className="btn btn-primary" onClick={() => navigate('/libros')}>Libros</button>
        <Form onSubmit={handleSubmit}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Periodo</th>
                <th>Inicio Año Escolar</th>
                <th>Nombre Institución</th>
                <th>Región</th>
                <th>Provincia</th>
                <th>Distrito</th>
                <th>Código Modular</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {config.map((item) => (
                <tr key={item.Id}>
                  <td>{item.Id}</td>
                  <td>{item.period}</td>
                  <td>{item.start_schol_year}</td>
                  <td>{item.institute_name}</td>
                  <td>{item.region}</td>
                  <td>{item.provincia}</td>
                  <td>{item.distrito}</td>
                  <td>{item.modular_code}</td>
                  <td>{item.phone}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>Editar</Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.Id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {editing !== null && (
            <div className="mt-4">
              <h3>Editar Configuración</h3>
              <Form.Group controlId="formPeriod">
                <Form.Label>Periodo</Form.Label>
                <Form.Control type="text" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formStartScholYear">
                <Form.Label>Inicio Año Escolar</Form.Label>
                <Form.Control type="date" value={formData.start_schol_year} onChange={(e) => setFormData({ ...formData, start_schol_year: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formInstituteName">
                <Form.Label>Nombre Institución</Form.Label>
                <Form.Control type="text" value={formData.institute_name} onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formRegion">
                <Form.Label>Región</Form.Label>
                <Form.Control type="text" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formProvincia">
                <Form.Label>Provincia</Form.Label>
                <Form.Control type="text" value={formData.provincia} onChange={(e) => setFormData({ ...formData, provincia: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formDistrito">
                <Form.Label>Distrito</Form.Label>
                <Form.Control type="text" value={formData.distrito} onChange={(e) => setFormData({ ...formData, distrito: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formModularCode">
                <Form.Label>Código Modular</Form.Label>
                <Form.Control type="text" value={formData.modular_code} onChange={(e) => setFormData({ ...formData, modular_code: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </Form.Group>
              <Button variant="primary" type="submit">Guardar Cambios</Button>{' '}
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Configuracion;
