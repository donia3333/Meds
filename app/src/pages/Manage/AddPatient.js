import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAutherUser } from "../../Storage";
import axios from "axios";
import M from '../../images/M.png';

const AddPatient = () => {

    const auth = getAutherUser();
    const [userData, setuserData] = useState({
        email:"",
        password:"",
        phone: "",
        err: "",
        loading: false,
        success: null,
    });
    const createpatient = (e) => {
        e.preventDefault();
    
        setuserData({ ...userData, loading: true });
    
      
        axios
          .post("http://localhost:2000/patient/addpatient", userData, {
            headers: {
              token: auth.token,
            },
          })
          .then((resp) => {
            setuserData({
              email:"",
              password:"",
              phone: "",
              err: null,
              loading: false,
              success: "Patient Added Successfully !",
            });
           
          })
          .catch((err) => {
            setuserData({
              ...userData,
              loading: false,
              success: null,
              err: "Something went wrong, please try again later !",
            });
          });
      };
      return (
        <div className="login">
           <div className="login-container">
                <div className="box" style={{height:"500px"}}>
                <h1><img src={M} alt="" />Add New patient Form</h1>
    
    {userData.err && (
      <Alert variant="danger" className="p-2">
        {userData.err}
      </Alert>
    )}

    {userData.success && (
      <Alert variant="success" className="p-2">
        {userData.success}
      </Alert>
    )}
     <Form onSubmit={createpatient}>
    <Form.Group className="mb-3">
      <Form.Control
        value={userData.email}
        onChange={(e) => setuserData({ ...userData, email: e.target.value })}
        type="email"
        required
        placeholder="Email"
      />
    </Form.Group>
    
    
    
    <Form.Group className="mb-3">
    <Form.Control
        value={userData.phone}
        onChange={(e) => setuserData({ ...userData, phone: e.target.value })}
        type="phone"
        required
        placeholder="Phone"
      />
    </Form.Group>
    <Form.Group className="mb-3">
    <Form.Control
        value={userData.password}
        onChange={(e) => setuserData({ ...userData, password: e.target.value })}
        type="password"
        required
        placeholder="password"
      />
    </Form.Group>

   

    <Button className="btn btn-primary w-100 my-3" variant="primary" type="submit">
      Add New patient
    </Button>
  </Form>

                </div>
           </div>

        </div>
    );
    
};
export default AddPatient;