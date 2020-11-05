import React, { Fragment, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CustomLine from '../beat-analyzer/CustomLine';
import './Historico.css';

const Historico = (props) => {
  const [tempoBD, setTempoBD] = useState(
    JSON.parse(localStorage.getItem('practices')) || { practices: [] }
  );
  console.log(tempoBD);

  return (
    <Fragment>
      <div className='container histo'>
        <h1>Historial de practicas</h1>
        <div className='row'>
          {tempoBD === null
            ? <p className="tempoNull">No se han registrado practicas.</p>
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

  const evalColor = (performance)  => {
    if (performance > 80){
      return {color:"limegreen"}
    }
    else if(performance > 31)
      return {color:"yellow"}
    else{
      return {color:"red"}
    }
  }


  return (
    <Fragment>
      <div
        class='card'
        style={{
          color: '#c6e6e8',
          backgroundColor: '#27324f',
          margin: '1em auto',
          borderRadius: '8px',
          justifyContent: "center",
        }}
      >
        <div class='card-body'>
          <h5 class='card-title'>{elem.kind}</h5>
          <p class='card-text'>{date}</p>
          <p>
            <span> Desempeño </span>{' '}
            {
              
            }
            <span style={evalColor(performance)}>{performance}%</span>
          </p>
          <p>
            <span> Duración </span>{' '}
            <span style={{ color: 'limegreen' }}>{elem.data.length}[s]</span>
          </p>
          {/* <p class='card-text'>{props.date}</p> */}
          <a href='#' class='btn btn-info' onClick={handleShow}>
            Ver más detalles
          </a>
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          style={{color: '#c6e6e8' }}
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