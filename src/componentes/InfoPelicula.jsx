import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const InfoPelicula = ({ pelicula, onClose }) => {
  const [resena, setResena] = useState('');
  const [generos, setGeneros] = useState([]);

  const guardarResena = (e) => {
    setResena(e.target.value);
  };

  useEffect(() => {
    obtenerGeneros();
  }, []);

  const obtenerGeneros = async () => {
    const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`
      );
      setGeneros(response.data.genres);
    } catch (error) {
      console.error('Error al obtener los géneros:', error);
    }
  };

  const obtenerNombresGeneros = (generoIds) => {
    const nombresGeneros = generoIds.map((generoId) => {
      const genero = generos.find((genero) => genero.id === generoId);
      return genero ? genero.name : '';
    });
    return nombresGeneros.join(', ');
  };

  if (!pelicula) {
    return null;
  }

  return (
    <Modal show={!!pelicula} onHide={onClose}>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{pelicula.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Row>
          <Col md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
              alt={pelicula.title}
              className="img-fluid"
            />
          </Col>
          <Col md={8}>
            <h5>Descripción:</h5>
            <p>{pelicula.overview}</p>
            <Row>
              <Col>
                <h5>Valoración:</h5>
                <p>{pelicula.vote_average} de 10.0</p>
              </Col>
              <Col>
                <h5>Total de votantes:</h5>
                <p>{pelicula.vote_count} personas</p>
              </Col>
            </Row>
            <h5>Fecha de estreno:</h5>
            <p>{pelicula.release_date}</p>
            <h5>Género:</h5>
            <p>{obtenerNombresGeneros(pelicula.genre_ids)}</p>
          </Col>
        </Row>
        <Form.Group controlId="resena">
          <Form.Label>Reseña:</Form.Label>
          <Form.Control as="textarea" rows={3} value={resena} onChange={guardarResena} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="bg-dark text-white">
        <Button variant="secondary" onClick={onClose}>
          Salir
        </Button>
        <Button variant="primary">Agregar a Lista de seguimiento</Button>
        <Button variant="primary">Dar reseña</Button>
        <div className="rating-stars">
          <label>Valoración:</label>
          {/* Calificación */}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoPelicula;
