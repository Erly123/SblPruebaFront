import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const Libros = () => {
  const [config, setConfig] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('primero');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBook, setCurrentBook] = useState({
    abbreviation: '',
    quantity: 0,
    title: '',
    grade: selectedGrade, // Establecer el grado por defecto
    category: '',
    year: new Date().getFullYear(), // Año por defecto
    observation: ''
  });

  useEffect(() => {
    fetchConfig();
    fetchBooksByGrade(selectedGrade);
  }, [selectedGrade]);

  const fetchConfig = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/sbl_config');
      setConfig(response.data[0]); // Suponemos que solo hay una configuración
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  };

  const fetchBooksByGrade = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/books/grade/${grade}`);
      setBooks(response.data);
    } catch (error) {
      console.error(`Error fetching books for grade ${grade}:`, error);
    }
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/books/${id}`);
      fetchBooksByGrade(selectedGrade);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/books/${currentBook.id}`, currentBook);
      setShowEditModal(false);
      fetchBooksByGrade(selectedGrade);
    } catch (error) {
      console.error('Error saving edited book:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook({ ...currentBook, [name]: value, grade: selectedGrade }); // Actualizar el grado
  };

  const handleSubmitNewBook = async (e) => {
    e.preventDefault();
    try {
      // Establecer el grado y el año antes de enviar
      setCurrentBook({ ...currentBook, grade: selectedGrade, year: new Date().getFullYear() });
      await axios.post('http://localhost:8000/api/books', currentBook);
      fetchBooksByGrade(selectedGrade);
      setCurrentBook({
        abbreviation: '',
        quantity: 0,
        title: '',
        grade: selectedGrade, // Restaurar el grado seleccionado
        category: '',
        year: new Date().getFullYear(), // Restaurar el año actual
        observation: ''
      });
    } catch (error) {
      console.error('Error adding new book:', error);
    }
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
            <Nav.Link href="/configuracion">Configuración</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Navbar bg="light" expand="lg" className="mt-3">
        <Navbar.Brand href="#">Libros</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#primero" onClick={() => setSelectedGrade('primero')}>Primero</Nav.Link>
            <Nav.Link href="#segundo" onClick={() => setSelectedGrade('segundo')}>Segundo</Nav.Link>
            <Nav.Link href="#tercero" onClick={() => setSelectedGrade('tercero')}>Tercero</Nav.Link>
            <Nav.Link href="#cuarto" onClick={() => setSelectedGrade('cuarto')}>Cuarto</Nav.Link>
            <Nav.Link href="#quinto" onClick={() => setSelectedGrade('quinto')}>Quinto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container mt-4">
        {config && (
          <h2>Libros de: {config.period}</h2>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Abreviatura</th>
              <th>Cantidad</th>
              <th>Título</th>
              <th>Grado</th>
              <th>Categoría</th>
              <th>Año</th>
              <th>Observación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.abbreviation}</td>
                <td>{book.quantity}</td>
                <td>{book.title}</td>
                <td>{book.grade}</td>
                <td>{book.category}</td>
                <td>{book.year}</td>
                <td>{book.observation}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(book)}>Editar</Button>
                  <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDelete(book.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="mt-3">
          <h3>Agregar Nuevo Libro</h3>
          <Form onSubmit={handleSubmitNewBook}>
            <Form.Group controlId="abbreviation">
              <Form.Label>Abreviatura</Form.Label>
              <Form.Control
                type="text"
                name="abbreviation"
                value={currentBook.abbreviation}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="quantity">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={currentBook.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="title">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentBook.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={currentBook.category}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="observation">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observation"
                value={currentBook.observation}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Agregar Libro
            </Button>
          </Form>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editAbbreviation">
              <Form.Label>Abreviatura</Form.Label>
              <Form.Control
                type="text"
                name="abbreviation"
                value={currentBook.abbreviation}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="editQuantity">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={currentBook.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="editTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentBook.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="editCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={currentBook.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="editObservation">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observation"
                value={currentBook.observation}
                onChange={handleInputChange}
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

export default Libros;
