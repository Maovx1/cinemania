import React, { useEffect, useState } from 'react';
// Acceso a la firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
// Estilos
import { Card, Button, Modal } from 'react-bootstrap';
// Componentes
import ListaFavoritasUsuario from './ListaFavoritasUsuario';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const Comunidad = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar la lista de usuarios
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado

  // Obtener la lista de usuarios desde Firestore al cargar el componente
  useEffect(() => {
    const db = firebase.firestore();
    const usuariosCollection = db.collection('info-usuario');
    const usuariosDocument = usuariosCollection.doc('datos');

    usuariosDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          const listaUsuarios = doc.data().datos;
          setUsuarios(listaUsuarios); // Actualiza el estado de 'usuarios' con la lista obtenida de Firestore
        }
      })
      .catch((error) => {
        console.error('Error al obtener la información de usuarios:', error);
      });
  }, []);

  // Manejar la visualización de las películas favoritas de un usuario en un modal
  const handleVerPeliculasFavoritas = (user) => {
    setSelectedUser(user); // Establece el usuario seleccionado en el estado 'selectedUser'
    setShowModal(true); // Muestra el modal estableciendo el estado 'showModal' en true
  };

  return (
    <div>
      <div className="bg-secondary">
        <h1 className="text-white text-center">Comunidad</h1>
        <div className="d-flex flex-wrap justify-content-center">
          {usuarios.map((user, index) => (
            <Card key={index} className="m-3 bg-dark" style={{ width: '18rem' }}>
              <Card.Img variant="top" src={`data:image/png;base64,${user.imagen}`} />
              <Card.Body className='text-white text-center'>
                <Card.Title>{user.nombreCompleto}</Card.Title>
                <Card.Text>
                  <strong>Apodo:</strong> {user.apodo}<br />
                  <strong>Edad:</strong> {user.edad}<br />
                  <strong>Sexo:</strong> {user.sexo}<br />
                  <strong>País:</strong> {user.pais}<br />
                  <strong>Descripción:</strong> {user.descripcion}
                </Card.Text>
                <Button variant="primary" onClick={() => handleVerPeliculasFavoritas(user)}>
                  Ver Películas Favoritas
                </Button>
                <br />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-xl">
        <Modal.Header closeButton className='bg-dark text-white'>
          <Modal.Title>Películas Favoritas de "{selectedUser?.apodo}"</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-white'>
          {selectedUser ? (
            <ListaFavoritasUsuario uid={selectedUser.uid} />
          ) : (
            <p>No se ha seleccionado ningún usuario.</p>
          )}
        </Modal.Body>
        <Modal.Footer className='bg-dark text-white'>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Comunidad;
