import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link} from "react-router-dom";
import axios from "axios";
import { getAutherUser } from "../../Storage";

const ManageMedicine = () => {
  
  const auth = getAutherUser();
  const [medicine, setmedicine] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setmedicine({ ...medicine, loading: true });
    axios
      .get("http://localhost:2000/medicine/list",{
        headers: {
          token: auth.token,
        },
      })
      .then((resp) => {
        setmedicine({ ...medicine, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setmedicine({
          ...medicine,
          loading: false,
          err: " something wrong, please try again ! ",
        });
      });
  }, [medicine.reload]);

  const deleteMedicine = (id) => {
    axios
      .delete("http://localhost:2000/medicine/deleteMedicine/" + id, {
        headers: {
          token: auth.token,
        },
      })
      .then((resp) => {
        setmedicine({ ...medicine, reload: medicine.reload + 1 });
      })
      .catch((err) => {});
  };

  return (
    <div className="manage-Medicine p-5">
      <div className="header d-flex justify-content-between mb-5">
        <h3 className="text-center ">Manage Medicine</h3>
        <Link to={"add"} className="btn btn-sm btn-primary m-t-3" style={{fontSize:"17px"}}>
          Add New Medicine +
        </Link>
      </div>
    
      <Table striped bordered hover className="styled-table w-100 my-5">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th> Name</th>
            <th> Description</th>
            <th> Price</th>
            <th> ExpirationDate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicine.results.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.id}</td>
              <td>
                <img
                  src={medicine.image_url}
                  alt={medicine.name}
                  className="image-avatar w-50 h-50" 
                />
              </td>
              <td style={{fontSize:"20px"}}> {medicine.name} </td>
              <td style={{fontSize:"18px"}}>{medicine.description}</td>
              <td style={{fontSize:"18px"}}>{medicine.price}</td>
              <td style={{fontSize:"18px"}}>{medicine.expirationDate}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger my-2"
                  onClick={(e) => {
                    deleteMedicine(medicine.id);
                  }}>
                  Delete
                </button>
                <Link
                  to={"" + medicine.id}
                  className="btn btn-sm btn-primary m-t-3">
                  Update
                </Link>
                {/* <Link to={"/" + medicine.id} className="btn btn-sm btn-info">
                  show
                </Link> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>

      
  
  );
};

export default ManageMedicine;