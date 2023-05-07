import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAutherUser } from "../../Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateCategory = () => {
    let { id } = useParams();
    const auth = getAutherUser();
    const [category, setCategory] = useState({
        name: "",
        description: "",
        image_url: null,
        err: "",
        loading: false,
        reload: false,
        success: null,
       
    });
    const image = useRef(null);
    const updateCategory = (e) => {
        e.preventDefault();
        setCategory({ ...category, loading: true });
        
        axios
            .put("http://localhost:2000/category/updateCategory/" + id, category, {
                headers: {
                    token: auth.token,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((resp) => {
                setCategory({
                    ...category,
                    loading: false,
                    success: "category updated successfully !",
                    reload: category.reload + 1,
                });
            })
            .catch((err) => {
                setCategory({
                    ...category,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again  !",
                });
            });
    };
    useEffect(() => {
        axios.get("http://localhost:2000/category/listSpacificCategory/"+ id)
            .then((result) => {
                setCategory({
                    ...category,
                    name: result.data.name,
                    description: result.data.description,
                    image_url: result.data.image_url
                });
            })
            .catch((err) => {
                setCategory({
                    ...category,
                    loading: false,
                    success: null,
                    err: "Something went wrong, please try again later !",
                });
            });
    },[category.reload]);
    return (
        <div className="login">
            <div className="login-container">
            <h1 className="py-3">Update Category form</h1>
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
           
            <div className="box" style={{width:"600px",height:"700px"}}>
            <Form onSubmit={updateCategory} className="text-center py-2">
            <img    
                    alt={category.name}
                    style={{
                        width: "300px",
                        height: "300px",
                        borderRadius: "20px",
                        marginBottom: "10px",
                    }}
                    src={category.image_url} 
                    />
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="CategoryName"
                    value={category.name}
                    onChange={(e) => setCategory
                        ({ ...category, name: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                <textarea
                        className="form-control"
                        placeholder="Description"
                        value={category.categoryDesc}
                        onChange={(e) => setCategory
                            ({ ...category,  description: e.target.value })}
                        rows={3}></textarea>
                </Form.Group>
                <Form.Group className="mb-3">
                    <input type="file" className="form-control" ref={image}/>
                </Form.Group>
                <Button className="btn btn-primary w-100" variant="primary" type="submit">
                    Update Category
                </Button>
            </Form>

            </div>
           
        </div>
        </div>
    );
};

export default UpdateCategory;