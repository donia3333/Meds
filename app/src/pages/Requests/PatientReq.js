import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { getAutherUser } from "../../Storage";
import '../../css/PatientsReq.css'


const PatientReq = (props) => {
    const auth = getAutherUser();
    const [appointments, setAppointments] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });
  
    useEffect(() => {
      setAppointments({ ...appointments, loading: true });
      axios
        .get(`http://localhost:2000/request/req/${auth.id}`)
        .then((resp) => {
          setAppointments({
            ...appointments,
            results: resp.data,
            loading: false,
            err: null,
          });
        })
        .catch((err) => {
          setAppointments({
            ...appointments,
            loading: false,
            err: " something went wrong, please try again later ! ",
          });
        });
    }, [appointments.reload]);
  
    return (
          <>
      
        <div className="container-fluid documentation">
          <div className="row justify-content-center">
        <Table striped  hover className="styled-table w-50 my-5">
          <thead>
            <tr>
               
               <th>name_of_medicine</th>
               <th>Accept</th>
               
            </tr>
          </thead>
          <tbody>
            {appointments.results.map((data) => (
              <tr key={data.id}>
                
                <td>{data.name_of_medicine}</td>
                 <td>{data.Accept}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div></div>

        
        
      </>
    );
  };

export default PatientReq;