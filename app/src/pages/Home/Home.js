import React, { useState, useEffect } from "react";
import MedicineCard from "../../components/MedicinesCard";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert"; 

const Home = () => {
  const [medicine, setmedicine] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  const [searchTerm , setsearchTerm ] = useState("");

  const filteredResults = medicine.results.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Search =() => {
    setmedicine({ ...medicine, loading: true });
    axios
      .get("http://localhost:2000/medicine/list", 
        {
          params: {
            searchTerm : searchTerm ,
          },
         
        },
        
        
       
      )
      .then((resp) => {
        console.log(resp);
        setmedicine({ ...medicine, results: resp.data, loading: false, err: null });
        axios.post("http://localhost:2000/medicine/search", {
        searchTerm : searchTerm ,
        user_id: JSON.parse(localStorage.getItem("user")).id,
      })
      .then((resp)=>{console.log(resp.data)})
      
     .catch ((error)=> {
      console.error(error);
     
    })
  
      })
      .catch((err) => {
        setmedicine({
          ...medicine,
          loading: false,
          err: " something wrong, please try again ! ",
        });
      });
  };


   useEffect (() => {
    setmedicine({ ...medicine, loading: true });
    axios
      .get("http://localhost:2000/medicine/list", 
      )
      .then((resp) => {
        console.log(resp);
        setmedicine({ ...medicine, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setmedicine({
          ...medicine,
          loading: false,
          err: " something wrong, please try again later ! ",
        });
      });
  },[]);

  return (
    <div className="home-container p-5">
      {/* Loader  */}
      {medicine.loading === true && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* LIST Medicines  */}
      {medicine.loading === false && medicine.err == null && (
        <>
          {/* Filter  */}
          <Form onSubmit={Search}>
            <Form.Group className="mb-3 d-flex">
              <Form.Control
                type="text"
                placeholder="Search"
                className="border bg-light rounded"
                required
                value={searchTerm}
                onChange={(e) => setsearchTerm (e.target.value)}
                
              />
             
              
            </Form.Group>
          </Form>
          
         

          {/* LIST Medicines  */}
          <div className="row ">
            {filteredResults.map((medicine) => (
              <div className="col-3 card-movie-container" key={medicine.id}>
                <MedicineCard
                  name={medicine.name}
                  image={medicine.image_url}
                  id={medicine.id}
                  price={medicine.price}
                  expirationDate={medicine.expirationDate}
                  category_id={medicine.category_id}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ERRORS HANDLING  */}
      {medicine.loading === false && medicine.err != null && (
        <Alert variant="danger" className="p-2">
          {medicine.err}
        </Alert>
      )}

      {medicine.loading === false &&
        medicine.err == null &&
        medicine.results.length === 0 && (
          <Alert variant="info" className="p-2">
            No Medicines, please try again later !
          </Alert>
        )}
    </div>
  );
};


export default Home;