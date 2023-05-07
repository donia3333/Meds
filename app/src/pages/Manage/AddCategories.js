import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAutherUser } from "../../Storage";
import axios from "axios";
import M from '../../images/M.png';


const AddCategories = () => {
   
    const auth = getAutherUser();
    const [category, setcategory] = useState({
      name: "",
      description: "",
      err: "",
      loading: false,
      success: null,
    });
  
    const image = useRef(null);
  
    const createCategory = (e) => {
      e.preventDefault();
  
      setcategory({ ...category, loading: true });
  
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("description", category.description);
      if (image.current.files && image.current.files[0]) {
        formData.append("image", image.current.files[0]);
      }
      axios
        .post("http://localhost:2000/category/addCategory", formData, {
          headers: {
            token: auth.token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          setcategory({
            name: "",
            description: "",
            err: null,
            loading: false,
            success: "Category Created Successfully !",
          });
          image.current.value = null;
        })
        .catch((err) => {
          setcategory({
            ...category,
            loading: false,
            success: null,
            err: "Something went wrong, please try again later !",
          });
        });
    };
  
    return (
      <div className="login">
         <div className="login-container">
           <div className="box" style={{height:"600px"}}>
           <h1><img src={M} alt="" />Add New Category Form</h1>
  
  {category.err && (
    <Alert variant="danger" className="p-2">
      {category.err}
    </Alert>
  )}

  {category.success && (
    <Alert variant="success" className="p-2">
      {category.success}
    </Alert>
  )}

  <Form onSubmit={createCategory}>
    <Form.Group className="mb-3">
      <Form.Control
        value={category.name}
        onChange={(e) => setcategory({ ...category, name: e.target.value })}
        type="text"
        required
        placeholder="Category Name"
      />
    </Form.Group>
    
    
    
    <Form.Group className="mb-3">
      <textarea
        className="form-control"
        placeholder="Description"
        value={category.description}
        required
        onChange={(e) =>
          setcategory({ ...category, description: e.target.value })
        }
        rows={5}></textarea>
    </Form.Group>

    <Form.Group className="mb-3">
      <input type="file" className="form-control" ref={image} required />
    </Form.Group>

    <Button className="btn btn-primary w-100 my-4" variant="primary" type="submit">
      Add New Category
    </Button>
  </Form>

           </div>
        
         </div>

      </div>
    );
};

export default AddCategories;