import React, { useState } from 'react'; 
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ onSubmit }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
      createdBy:''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files[0] });
    };

    const handleShowAllProducts = () => {
        navigate('/allProducts');
    }

    const handleCancel = () => {
        navigate('/allProducts');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.createdBy) {
            setErrorMessage('All fields are required!');
            return;
        }
        const { name, createdBy } = formData;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/api/createCategory', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Category created successfully');

                } else {
                    console.error('Error creating category:', xhr.responseText);

                }
            }
        };
        xhr.send(
            JSON.stringify({
                categoryname: name,
                createdBy
            })
        );
        navigate('/allProducts');
    };

    return (
        <Container>
            <h1 className="text-center mt-5">Add Category</h1>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                    <div>
                        <div className="form-group mx-3 mt-3">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group mx-3 mt-3">
                            <label htmlFor="createdBy">Created By</label>
                            <input type="text" className="form-control" id="createdBy" name="createdBy" value={formData.description} onChange={handleChange} />
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-between mt-3">
                <Col>
                    <button className="btn btn-primary" onClick={handleShowAllProducts}>
                        Show All Categories
                    </button>
                </Col>
                <Col className="text-right">
                    <button className="btn btn-danger mr-2 mx-3" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary mr-2 mx-3" onClick={handleSubmit}>
                        Submit
                    </button>
                </Col>
            </Row>
        </Container>

    );
};

export default ProductForm;
