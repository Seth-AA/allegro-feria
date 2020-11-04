import React, { Fragment, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CustomLine from '../beat-analyzer/CustomLine';
const Historico = (props) => {
  const [tempoBD, setTempoBD] = useState(
    JSON.parse(localStorage.getItem('practices')) || { practices: [] }
  );
  console.log(tempoBD);

  return (
    <Fragment>
      <div className='container'>
        <div className='row'>
          {tempoBD === null
            ? 'AUN NADA!'
            : tempoBD.practices.map((elem, id) => {
                return <Card key={id} elem={elem} />;
              })}
        </div>
      </div>
    </Fragment>
  );
};
export default Historico;

const Card = ({ elem }) => {
  const date = new Date(elem.date).toLocaleString('es-CL');
  const performance = Math.round(
    (100 * (elem.data.length - [...new Set(elem.data)].length)) / elem.data.length,
    2
  );

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <div
        class='card col-lg-3'
        style={{
          color: '#c6e6e8',
          backgroundColor: '#27324f',
          margin: '10px',
          borderRadius: '8px',
        }}
      >
        <div class='card-body'>
          <h5 class='card-title'>{elem.kind}</h5>
          <p class='card-text'>{date}</p>
          <p>
            <span> Desempeño </span>{' '}
            <span style={{ color: 'limegreen' }}>{performance}%</span>
          </p>
          <p>
            <span> Duración </span>{' '}
            <span style={{ color: 'limegreen' }}>{elem.data.length}[s]</span>
          </p>
          {/* <p class='card-text'>{props.date}</p> */}
          <a href='#' class='btn btn-info' onClick={handleShow}>
            Ver mas detalles
          </a>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          style={{ backgroundColor: '#27324f', color: '#c6e6e8' }}
          centered
          size='xl'
          //   dialogClassName='modal-90w'
        >
          <Modal.Header style={{ backgroundColor: '#27324f', color: '#c6e6e8' }}>
            <Modal.Title>
              {elem.kind} el {date}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#27324f', color: '#c6e6e8' }}>
            <CustomLine data={elem.data} />
          </Modal.Body>
        </Modal>
      </div>
    </Fragment>
  );
};
