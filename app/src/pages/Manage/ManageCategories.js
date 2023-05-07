import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link} from "react-router-dom";
import axios from "axios";
import { getAutherUser } from "../../Storage";

const ManageCategories = () => {
    const auth = getAutherUser();
    const [categoryes, setcategoryes] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });
  
    useEffect(() => {
      setcategoryes({ ...categoryes, loading: true });
      axios
        .get("http://localhost:2000/category/viewCategoryes",{
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setcategoryes({ ...categoryes, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setcategoryes({
            ...categoryes,
            loading: false,
            err: " something wrong, please try again later ! ",
          });
        });
    }, [categoryes.reload]);
  
    const deleteCategory = (id) => {
      axios
        .delete("http://localhost:2000/category/deleteCategory/" + id, {
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setcategoryes({ ...categoryes, reload:categoryes.reload + 1 });
        })
        .catch((err) => {});
    };
  
    return (
      <div className="manage-Medicine p-5">
        <div className="header d-flex justify-content-between mb-5">
          <h3 className="text-center ">Manage categories</h3>
          <Link to={"add_category"} className="btn btn-sm btn-primary m-t-3" style={{fontSize:"17px"}}>
            Add New category +
          </Link>
        </div>
  
         <Table striped bordered hover className="styled-table w-100 my-5">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th> Name</th>
              <th> Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryes.results.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="image-avatar w-50 h-50" 
                  />
                </td>
                <td style={{fontSize:"20px"}}> {category.name} </td>
                <td style={{fontSize:"18px"}}>{category.description}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger my-3"
                    onClick={(e) => {
                        deleteCategory(category.id);
                    }}>
                    Delete
                  </button>
                  <Link
                    to={`update/${category.id}`}
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


export default ManageCategories;
