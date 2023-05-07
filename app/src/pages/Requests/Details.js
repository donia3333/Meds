import React , { useState,useEffect} from "react";
import axios from "axios";
import "../../css/Details.css"
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert"; 
import Spinner from "react-bootstrap/Spinner";
import { getAutherUser } from '../../Storage';
import Accordion from 'react-bootstrap/Accordion';

const Details = () => {
    const auth = getAutherUser();
    let {id} = useParams();
    const [med, setmed] = useState({
        loading: true,
        results:null,
        err: null,
        success: null,
      });
     
      useEffect (() => {
        display();
      },[]);
      const display=() =>{
        setmed({ ...med, loading: true });
        axios
          .get("http://localhost:2000/medicine//listSpacificMedicine/"+id)
          .then((resp) => {
            setmed({ ...med, results: resp.data, loading: false, err: null,});
            
          })
          .catch((err) => {
            setmed({
              ...med,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      }
      const SendReq =() => {
        setmed({ ...med, loading: true , success: "Request Sent Successfully !", });
        console.log(auth.id);
        axios
          .post(`http://localhost:2000/request/sendrequest/${id}`,
            {
               headers:{
                token: auth.token,
                id: auth.id,
                
              }
            }
          
          )
          .then((resp) => {
            console.log(resp);
             display();            
            })
            
          .catch((err) => {
            setmed({
              ...med,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      };
    return (

      

        <div className="Request-container p-5">
          {med.err && (
        <Alert variant="danger" className="p-2">
          {med.err}
        </Alert>
      )}

      {med.success && (
        <Alert variant="success" className="p-2">
          {med.success}
        </Alert>
      )}
         <div className="home-container ">
           {/* Loader  */}
           {med.loading === true && (
             <div className="text-center">
               <Spinner animation="border" role="status">
                 <span className="visually-hidden">Loading...</span>
               </Spinner>
            </div>
      )}
      </div>
      {/* LIST Medicines  */}
      {med.loading === false && med.err == null && (
         <>
          {/* Details for medicines */}
           <div className="row">
             <div className="image col-3">
               <img className="medicine-image" src={med.results.image_url} alt={med.results.name}/>
             </div>
            <div className="details col-9">
              {/* Request for medicines */}
            
               <h1 className="medicine-name">{med.results.name} <button onClick={()=>SendReq()} className='btn btn-primary p-y-5 mx-3' style={{width:"200px",height:"50px",fontSize:"20px"}}>Request</button></h1>
               <Accordion defaultActiveKey="0">
      <Accordion.Item className="medicine-desc" eventKey="0">
        <Accordion.Header>Description</Accordion.Header>
        <Accordion.Body>
        {med.results.description}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item className="medicine-price"  eventKey="1">
        <Accordion.Header>Price</Accordion.Header>
        <Accordion.Body>
         EGP {med.results.price}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item className="medicine-date" eventKey="3">
        <Accordion.Header>Expiration_Date</Accordion.Header>
        <Accordion.Body>
        {med.results.expirationDate}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
               
            </div>

        </div>
         </>

      )}

     
    </div>
 );
};

export default Details;