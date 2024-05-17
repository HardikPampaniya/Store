import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        if(location.pathname === '/'){
            localStorage.removeItem('accessToken')
        }
    }, [location.pathname]);

    const handleRegister = () => {
        navigate('/addUser');
    };

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email or password is empty
        if (!email || !password) {
            setErrorMessage('Please enter both email and password.');
            return;
        }
         
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('accessToken', token);
                toast.success("Login Successfully")// Display success toast
                navigate('/allProducts');
            } else {
                setErrorMessage('Login failed. Please try again.');
                console.error('Login failed:', response.data.message);
                notifyError('Login failed. Please try again.'); // Display error toast
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setErrorMessage('An error occurred during login. Please try again later.');
            notifyError('An error occurred during login. Please try again later.'); // Display error toast
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="login-form p-4 border rounded">
                <h3 className="text-center mb-4">Welcome </h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        Login
                    </Button>
                    <Button variant="outline-primary" className="w-100" onClick={handleRegister}>
                        Sign Up
                    </Button>
                </Form>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Container>
    );
};

export default Login;
