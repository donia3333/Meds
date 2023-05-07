import React from "react";
import Card from "react-bootstrap/Card";
import "../css/MedicinesCard.css";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";

const MedicinesCard = (props) => {
  return (
    <div>
      <Card className="box-card">
      <Card.Img className="card-image" variant="top" src={props.image} />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>EGP{props.price}</ListGroup.Item>
        <ListGroup.Item>{props.expirationDate}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
         <Link className="btn btn-primary w-100" to={"/" + props.id}>
           Request
          </Link>
      </Card.Body>
    </Card>
    </div>
  );
};

export default MedicinesCard;