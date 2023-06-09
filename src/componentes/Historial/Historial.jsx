import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
import { Card, Container, Row, Col, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const Historial = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const peliculasPorPagina = 4; // Número de películas a mostrar por página

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      // Se accede ala coleccion de la firestore
      const db = firebase.firestore();
      const historialCollection = db.collection('historial');
      const historialDocument = historialCollection.doc('datos');

      historialDocument
        .get()
        .then((doc) => {
          if (doc.exists) {
            const peliculasData = doc.data().peliculas || [];
            // Se busca el mismo uid
            const peliculasUsuario = peliculasData.filter((pelicula) => pelicula.uid === user.uid);
            const peliculasUnicas = obtenerPeliculasUnicas(peliculasUsuario);
            obtenerPeliculas(peliculasUnicas);
          }
        })
        .catch((error) => {
          console.error('Error al obtener el historial:', error);
        });
    }
  }, []);

  // Funcion para obtener peliculas sin repetirse
  const obtenerPeliculasUnicas = (peliculasUsuario) => {
    const peliculasIds = peliculasUsuario.map((pelicula) => pelicula.peliculaId);
    const peliculasUnicas = [];

    peliculasIds.forEach((peliculaId) => {
      if (!peliculasUnicas.includes(peliculaId)) {
        peliculasUnicas.push(peliculaId);
      }
    });

    return peliculasUnicas;
  };

  // Se obtienes las peliculas dependiendo del id de la misma
  const obtenerPeliculas = async (peliculasUnicas) => {
    const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';

    const requests = peliculasUnicas.map((peliculaId) =>
      axios.get(`https://api.themoviedb.org/3/movie/${peliculaId}?api_key=${API_KEY}&language=es`)
    );

    try {
      const responses = await axios.all(requests);
      const moviesData = responses.map((response) => response.data);
      setPeliculas(moviesData);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      setPeliculas([]);
    }
  };

  // Función para cambiar la página actual
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina); // Actualizar la página actual al hacer clic en un número de página
  };

  // Calcular el índice de inicio y fin de las películas a mostrar en la página actual
  const indiceInicio = (paginaActual - 1) * peliculasPorPagina;
  const indiceFin = indiceInicio + peliculasPorPagina;
  const peliculasPaginaActual = peliculas.slice(indiceInicio, indiceFin);

  // Calcular el número total de páginas
  const numeroTotalPaginas = Math.ceil(peliculas.length / peliculasPorPagina);

  // Efecto para ajustar la página actual si se eliminó la última película de la página actual
  useEffect(() => {
    if (peliculas.length > 0 && indiceInicio >= peliculas.length) {
      const nuevaPaginaActual = Math.ceil(peliculas.length / peliculasPorPagina);
      setPaginaActual(nuevaPaginaActual);
    }
  }, [peliculas, peliculasPorPagina, indiceInicio]);

  // Funcion para borrar el historial completo de la bd
  const borrarHistorial = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const historialCollection = db.collection('historial');
      const historialDocument = historialCollection.doc('datos');

      historialDocument
        .get()
        .then((doc) => {
          if (doc.exists) {
            const peliculasData = doc.data().peliculas || [];
            const nuevosDatos = peliculasData.filter((pelicula) => pelicula.uid !== user.uid);

            historialDocument
              .update({
                peliculas: nuevosDatos
              })
              .then(() => {
                console.log('Historial borrado con éxito');
                setPeliculas([]);
              })
              .catch((error) => {
                console.error('Error al borrar el historial:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error al obtener el historial:', error);
        });
    }
  };

  return (
    <Container className='text-white'>
      <h1>Historial de películas</h1>
      <Row>
        {peliculasPaginaActual.map((pelicula, index) => (
          <Col sm={6} md={4} lg={3} key={index}>
            <Card className='bg-dark mt-3 text-light'>
              <Card.Img variant='top' src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} />
              <Card.Body className='text-center'>
                <Card.Title>{pelicula.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Paginación */}
      <div className='d-flex justify-content-center mt-4'>
        <Pagination>
          {Array.from({ length: numeroTotalPaginas }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === paginaActual}
              onClick={() => cambiarPagina(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      {/* Botón para borrar el historial */}
      <div className='d-flex justify-content-center mt-4'>
        <Button variant='danger' onClick={borrarHistorial}>
          Borrar historial
        </Button>
      </div>
    </Container>
  );
};

export default Historial;
