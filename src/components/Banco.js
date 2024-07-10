import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const Banco = () => {
  const [bankbooks, setBankbooks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBankbook, setCurrentBankbook] = useState({
    BankId: '',
    studentId: '',
    observation: '',
    Grado: ''
  });

  useEffect(() => {
    fetchBankbooks();
  }, []);

  const fetchBankbooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/bankbooks');
      setBankbooks(response.data);
    } catch (error) {
      console.error('Error fetching bankbooks:', error);
    }
  };

  const handleEdit = (bankbook) => {
    setCurrentBankbook(bankbook);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/bankbooks/${id}`);
      fetchBankbooks();
    } catch (error) {
      console.error('Error deleting bankbook:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/bankbooks/${currentBankbook.id}`, currentBankbook);
      setShowEditModal(false);
      fetchBankbooks();
    } catch (error) {
      console.error('Error saving edited bankbook:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBankbook({ ...currentBankbook, [name]: value });
  };

  const handleSubmitNewBankbook = async (e) => {
    e.preventDefault();
    console.log('Submitting new bankbook:', currentBankbook);
    try {
      await axios.post('http://localhost:8000/api/bankbooks', currentBankbook);
      fetchBankbooks();
      setCurrentBankbook({
        BankId: '',
        studentId: '',
        observation: '',
        Grado: ''
      });
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error adding new bankbook:', error.response.data);
      } else {
        console.error('Error adding new bankbook:', error);
      }
    }
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Sistema de Gestión de Bancos de Libros</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#">Libros</Nav.Link>
            <Nav.Link href="#">Asignación</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link href="/configuracion">Configuración</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container mt-4">
        <h2>Banco de Libros</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>BankId</th>
              <th>StudentId</th>
              <th>Observación</th>
              <th>Grado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bankbooks.map((bankbook) => (
              <tr key={bankbook.id}>
                <td>{bankbook.id}</td>
                <td>{bankbook.BankId}</td>
                <td>{bankbook.studentId}</td>
                <td>{bankbook.observation}</td>
                <td>{bankbook.Grado}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(bankbook)}>Editar</Button>
                  <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDelete(bankbook.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="mt-3">
          <h3>Agregar Nuevo Banco de Libro</h3>
          <Form onSubmit={handleSubmitNewBankbook}>
            <Form.Group controlId="BankId">
              <Form.Label>BankId</Form.Label>
              <Form.Control
                type="text"
                name="BankId"
                value={currentBankbook.BankId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="studentId">
              <Form.Label>StudentId</Form.Label>
              <Form.Control
                type="number"
                name="studentId"
                value={currentBankbook.studentId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="observation">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                type="text"
                name="observation"
                value={currentBankbook.observation}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="Grado">
              <Form.Label>Grado</Form.Label>
              <Form.Control
                type="text"
                name="Grado"
                value={currentBankbook.Grado}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Agregar Banco de Libro
            </Button>
          </Form>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Banco de Libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editBankId">
              <Form.Label>BankId</Form.Label>
              <Form.Control
                type="text"
                name="BankId"
                value={currentBankbook.BankId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editStudentId">
              <Form.Label>StudentId</Form.Label>
              <Form.Control
                type="number"
                name="studentId"
                value={currentBankbook.studentId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editObservation">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                type="text"
                name="observation"
                value={currentBankbook.observation}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editGrado">
              <Form.Label>Grado</Form.Label>
              <Form.Control
                type="text"
                name="Grado"
                value={currentBankbook.Grado}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Banco;
