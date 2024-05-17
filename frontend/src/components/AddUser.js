import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddBook.css'; // Import CSS file for styling

const AddBook = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    hobbies: '',
    profile_pic: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('All fields are required!');
      return;
    }

    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status >= 200) {
          console.log('Registered successfully.');
          navigate('/');
        } else {
          console.log(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Error registering user:', error.message || JSON.stringify(error));
      }
    }
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      profile_pic: event.target.files[0],
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Sign Up</h2>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input type="text" required className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input type="text" required className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" required className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input type="password" required className="form-control" id="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input type="password" required className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select className="form-select" required id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="hobbies" className="form-label">
                Hobbies
              </label>
              <input type="text" required className="form-control" id="hobbies" name="hobbies" value={formData.hobbies} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="profile_pic" className="form-label">
                Profile Picture
              </label>
              <input type="file" className="form-control" id="profile_pic" name="profile_pic" onChange={handleFileChange} />
            </div>

            <div className="button-group">
              <button className="btn btn-primary mx-1" type="button" onClick={handleLogin}>
                Login
              </button>
              <button className="btn btn-primary mx-1" type="button" onClick={handleSubmit}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
