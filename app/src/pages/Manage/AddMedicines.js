import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getAutherUser } from "../../Storage";
import axios from "axios";
import M from '../../images/M.png';

const AddMedicine = () => {
  const auth = getAutherUser();
  const [medicine, setmedicine] = useState({
    name: "",
    description: "",
    expirationDate:"",
    price:"",
    category_id:"",
    err: "",
    loading: false,
    success: null,
  });

  const image = useRef(null);

  const createMedicine = (e) => {
    e.preventDefault();

    setmedicine({ ...medicine, loading: true });

    const formData = new FormData();
    formData.append("name", medicine.name);
    formData.append("description", medicine.description);
    formData.append("expirationDate", medicine.expirationDate);
    formData.append("price", medicine.price);
    formData.append("category_id", medicine.category_id);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    axios
      .post("http://localhost:2000/medicine/addMedicine", formData, {
        headers: {
          token: auth.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setmedicine({
          name: "",
          description: "",
          expirationDate:"",
          price:"",
          category_id:"",
          err: null,
          loading: false,
          success: "Medicine Created Successfully !",
        });
        image.current.value = null;
      })
      .catch((err) => {
        setmedicine({
          ...medicine,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };

  return (
    <div className="login">
      <div className="login-container">
         <div className="box" style={{height:"750px"}}>
         <h1><img src={M} alt="" />Add New Medicine Form</h1>

      

<Form onSubmit={createMedicine}>
  <Form.Group className="mb-3">
    <Form.Control
      value={medicine.name}
      onChange={(e) => setmedicine({ ...medicine, name: e.target.value })}
      type="text"
      required
      placeholder="Medicine Name"
    />
  </Form.Group>
  <Form.Group className="mb-3">
    <Form.Control
      value={medicine.price}
      onChange={(e) => setmedicine({ ...medicine, price: e.target.value })}
      type="number"
      required
      placeholder="Medicine price"
    />
  </Form.Group>
  <Form.Group className="mb-3">
    <Form.Control
      value={medicine.expirationDate}
      onChange={(e) => setmedicine({ ...medicine, expirationDate: e.target.value })}
      type="date"
      required
      placeholder="Medicine date"
    />
  </Form.Group>
  <Form.Group className="mb-3">
    <Form.Control
      value={medicine.category_id}
      onChange={(e) => setmedicine({ ...medicine, category_id: e.target.value })}
      type="number"
      required
      placeholder="Medicine category_id"
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <textarea
      className="form-control"
      placeholder="Description"
      value={medicine.description}
      required
      onChange={(e) =>
        setmedicine({ ...medicine, description: e.target.value })
      }
      rows={5}></textarea>
  </Form.Group>

  <Form.Group className="mb-3">
    <input type="file" className="form-control" ref={image} required />
  </Form.Group>

  <Button className="btn btn-primary w-100 my-4" variant="primary" type="submit">
    Add New Medicine
  </Button>
</Form>

         </div>
      </div>

    </div>
  );
};

export default AddMedicine;