import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './component.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Search from './Search';
import './Product data.css'; 


const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState([])
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query.trim() !== '') {
           navigate(`/search/?name=${encodeURIComponent(query)}`);
        }
    };

    const navigate = useNavigate();

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/')
    }

    const handleClick = () => {
        navigate('/addProduct');
    }

    const handleImageClick = () => {

    }

    const handleDelete = (id) => {

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log('No token found. User is not authenticated.');
            navigate("/")
        }

        const isConfirmed = window.confirm('Are you sure you want to delete this product?');

        if (!isConfirmed) {
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:5000/api/deleteProducts/${id}`, true);
        xhr.setRequestHeader('Authorization', token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                setErrorMessage('Product deleted successfully');
                console.log('product deleted successfully');
                window.location.reload()
                
            } else {
                setErrorMessage("Failed to delete product. As you have products/category.");
                console.error('Failed to delete product. Status:', xhr.status);
                window.location.reload()
            }
        };
        xhr.onerror = function () {
            setErrorMessage('Error deleting product. Network error');
            console.error('Error deleting product. Network error');
        };
        xhr.send();
    }

    useEffect(() => {


        const fetchProducts = async () => {
            try {

                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found. User is not authenticated.');
                    navigate("/")
                }
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://localhost:5000/api/products', true);
                xhr.setRequestHeader('Authorization', token);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            setProducts(response);
                        } else {
                            console.error('Error fetching products:', xhr.statusText);
                        }
                    }
                };
                xhr.send();
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found. User is not authenticated.');
                    navigate("/");
                    return;
                }

                const headers = {
                    'Authorization': token
                };

                const response = await axios.get(`http://localhost:5000/api/users/profile`, { headers });
                setUser(response.data.user);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
        fetchProducts();
    }, []);


    return (
        <div className="product-table-container">
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <div className="product-navbar">
                    <h2 className="navbar-brand">Product list</h2>
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="search" onClick={handleSearch}>
                        Search
                    </button>
                    <button className="logout" onClick={handleLogout}>
                        Log    Out
                    </button>
                    <a className="navbar-brand" href='' onClick={handleImageClick}>
                        <img
                            src={`http://localhost:5000${user.profile_pic}`}
                            height="30"
                            width="30"
                            alt="user"
                        />
                    </a>
                </div>
            </div>
        </nav>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <table className="table product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Images</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(products) && products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category_name}</td>
                            <td>{product.price}</td>
                            <td>
                                <div>
                                    {product.images && product.images.split(',').map((imagePath, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000${imagePath}`}
                                            alt={`Product ${index}`}
                                            style={{ width: '50px', height: '50px', margin: '10px' }}
                                        />
                                    ))}
                                </div>
                            </td>
                            <td>{<button className="btn btn-primary btn-sm" onClick={() => navigate(`/editProduct/${product.id}`)}>Edit</button>}</td>
                            <td>{<button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            

           <div className="product-actions">
                <button
                    className="btn btn-primary"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous Page
                </button>
                <span>Page {page}</span>
                <button
                    className="btn btn-primary"
                    onClick={handleNextPage}
                    disabled={products.length < pageSize}
                >
                    Next Page
                </button>
            </div>
            <div className="add-product-button">
                <button className="btn btn-primary" onClick={handleClick}>
                    Add Product
                </button>
            </div>
        </div>
    );
};

export default ProductTable;
