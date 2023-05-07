import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAutherUser } from "../../Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdatePatient = () => {
    let { id } = useParams();
    const auth = getAutherUser();
    const [patient, setpatient] = useState({
        email: "",
        password: "",
        phone: null,
        err: "",
        loading: false,
        reload: false,
        success: null,
       
    });
    const updatePatient = (e) => {
        e.preventDefault();
        setpatient({ ...patient, loading: true });
        
        axios
            .put("http://localhost:2000/patient/updatepatient/" + id, patient, {
                headers: {
                    token: auth.token,
                },
            })
            .then((resp) => {
                setpatient({
                    ...patient,
                    loading: false,
                    success: "patient updated successfully !",
                    reload: patient.reload + 1,
                });
            })
            .catch((err) => {
                setpatient({
                    ...patient,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    };
    useEffect(() => {
        axios.get("http://localhost:2000/patient/listSpacificpatient/"+ id)
            .then((result) => {
                setpatient({
                    ...patient,
                    email: result.data.email,
                    password: result.data.password,
                    phone: result.data.phone
                });
            })
            .catch((err) => {
                setpatient({
                    ...patient,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    }, [patient.reload]);
    return (
        <div className="login">
            <div className="login-container">
            
            <div className="box" style={{width:"600px",height:"450px"}}>
            <h1>Update patient form</h1>
            {
               patient.err && (
                    <Alert variant="danger" className='p-2'>
                        {patient.err}
                    </Alert>
                )
            }
            {patient.success && (
                <Alert variant="success" className="p-2">
                    {patient.success}
                </Alert>
            )}
            <Form onSubmit={updatePatient} className="text-center py-2">
                <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Email"
                    value={patient.email}
                    onChange={(e) => setpatient
                        ({ ...patient, email: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type="password" placeholder="password"
                    value={patient.password}
                    onChange={(e) => setpatient
                        ({ ...patient, password: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type="phone" placeholder="phone"
                    value={patient.phone}
                    onChange={(e) => setpatient
                        ({ ...patient, phone: e.target.value })} />
                </Form.Group>
                <Button className="btn btn-primary w-100" variant="primary" type="submit">
                    Update patient
                </Button>
            </Form>
            </div>
        </div>

        </div>
    );
};

export default UpdatePatient;