import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link} from "react-router-dom";
import axios from "axios";
import { getAutherUser } from "../../Storage";

const ManagePatient = () => {
    const auth = getAutherUser();
    const [users, setusers] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });
  
    useEffect(() => {
      setusers({ ...users, loading: true });
      axios
        .get("http://localhost:2000/patient/listpatient",{
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setusers({ ...users, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setusers({
            ...users,
            loading: false,
            err: " something went wrong, please try again later ! ",
          });
        });
    }, [users.reload]);
  
    const deletepatient = (id) => {
      axios
        .delete("http://localhost:2000/patient/deletepatient/" + id, {
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setusers({ ...users, reload:users.reload + 1 });
        })
        .catch((err) => {});
    };
  
    return (
      <div className="manage-Medicine p-5">
        <div className="header d-flex justify-content-between mb-5">
          <h3 className="text-center ">Manage patients</h3>
          <Link to={"add_patient"} className="btn btn-sm btn-primary m-t-3" style={{fontSize:"17px"}}>
            Add New patient +
          </Link>
        </div>
  
         <Table striped bordered hover className="styled-table w-100 my-5">
          <thead>
            <tr>
              <th>#</th>
              <th>email</th>
              <th> phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { users.results.map((userData) => (
              <tr key={userData.id}>
                <td>{userData.id}</td>
                <td style={{fontSize:"18px"}}> {userData.email} </td>
                <td style={{fontSize:"18px"}}>{userData.phone}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger mx-3"
                    onClick={(e) => {
                        deletepatient(userData.id);
                    }}>
                    Delete
                  </button>
                  <Link
                    to={`update_patient/${userData.id}`}
                    className="btn btn-sm btn-primary m-t-3">
                    Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> 
      </div>
    );
};

export default ManagePatient;