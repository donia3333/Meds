import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/esm/Table";
import { Link } from "react-router-dom";

const ManageReq = () => {
  
  const [patient, setPatient] = useState([]);
  

  useEffect(() => {
    axios
      .get(`http://localhost:2000/request/reqadmin`)
      .then((res) => setPatient(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      

      <div className="container-fluid documentation">
        <div className="row justify-content-center">
              <Table striped bordered hover className="w-50 m-3">
                <thead>
                  <tr>
                    <th>Name Of User </th>
                    <th>Name Of Medicine </th>
                    <th>Action</th>
            
                  </tr>
                </thead>
                <tbody>
                  {patient.map((data, i) => (
                    <tr key={i}>
                      <td>{data.name_of_user}</td>
                      <td>{data.name_of_medicine}</td>
                      <td>{data.Accept}</td>
                      

                      <td>
                      <Link
                          className="btn btn-primary ms-2 mb-2"
                          style={{width:"150px" , height:"50px"}}
                          to={`Accept/${data.id}`}
                        >
                          update request
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
    </>
  );
};

export default ManageReq;