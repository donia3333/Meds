import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAutherUser } from "../../Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateMedicine = () => {
    let { id } = useParams();
    const auth = getAutherUser();
    const [medicine, setmedicine] = useState({
        name: "",
        description: "",
        image_url: null,
        expirationDate:"",
        price:"",
        category_id:"",
        err: "",
        loading: false,
        reload: false,
        success: null,
    });
    const image = useRef(null);

    const updateMedicine = (e) => {
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
            .put("http://localhost:2000/medicine/updateMedicine/" + id, formData, {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((resp) => {
                   setmedicine({
                    ...medicine,
                    loading: false,
                    success: "Medicine updated successfully !",
                    reload: medicine.reload + 1,
                });
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

    useEffect(() => {
        axios
            .get("http://localhost:2000/medicine//listSpacificMedicine/" +id)
            .then((resp) => {
                setmedicine({
                    ...medicine,
                    name: resp.data.name,
                    description: resp.data.description,
                    image_url: resp.data.image_url,
                    price: resp.data.price,
                    expirationDate: resp.data.expirationDate,
                    category_id: resp.category_id,

                });
            })
            .catch((err) => {
                setmedicine({
                    ...medicine,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    }, [medicine.reload]);

    return (
       <div className="login">
            <div className="login-container">
            <h1 className="py-3">Update Medicine Form</h1>

            {medicine.err && (
                <Alert variant="danger" className="p-2">
                    {medicine.err}
                </Alert>
            )}

            {medicine.success && (
                <Alert variant="success" className="p-2">
                    {medicine.success}
                </Alert>
            )}
                <div className="box" style={{width:"800px",height:"900px"}}>
            <Form onSubmit={updateMedicine} className="text-center py-2">
                <img
                    alt={medicine.name}
                    style={{
                        width: "300px",
                        height: "300px",
                        borderRadius: "20px",
                        marginBottom: "10px",
                    }}
                    src={medicine.image_url}
                />

                
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Medicine Name"
                        value={medicine.name}
                        onChange={(e) => setmedicine({ ...medicine, name: e.target.value })}
                    />
                </Form.Group>
                  <Form.Group className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        value={medicine.description}
                        onChange={(e) =>
                            setmedicine({ ...medicine, description: e.target.value })
                        }
                        rows={5}></textarea>
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
                    <input type="file" className="form-control" ref={image} />
                </Form.Group>

                <Button className="btn btn-primary w-100 my-2" variant="primary" type="submit">
                    Update Medicine
                </Button>

                
            </Form>
        </div>
       </div>
       </div>
    );
};

export default UpdateMedicine;