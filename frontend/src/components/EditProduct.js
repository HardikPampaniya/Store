import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate, json } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    image: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {

      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          console.log('No token found. User is not authenticated.');
          navigate('/');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/productById/${id}`, {
          headers: {
            'Authorization': token, 
            'Content-type': 'multipart/form-data',
          }
        });

        if (response.status === 200) {
          const data = await response.json();
          setProduct(data);
        
        } else if (response.status === 401) {
          console.log('Unauthorized access. Token may be invalid or expired.');
          navigate('/');
        } else {
          console.log('Error fetching product data. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleShowAllBook = () => {
    navigate('/allProducts');
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, images: e.target.files[0] });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.description || !product.categoryId || !product.price) {
      setErrorMessage('All fields are required!');
      return;
    }

    const updateData = new FormData();
    updateData.append('name', product.name);  
    updateData.append('description', product.description);
    updateData.append('categoryId', product.categoryId);
    updateData.append('price', product.price);
    updateData.append('images', product.image); 
    console.log(updateData)

    try {
      const response = await fetch(`http://localhost:5000/api/updateProduct/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': localStorage.getItem('accessToken'),
          // 'Content-Type': 'multipart/form-data',
        },
        body: updateData 
      });
      if (response.ok) {
        console.log('Product updated successfully');
        navigate('/allProducts');
      } else {
        console.error('Failed to update product:', response.statusText);
        setErrorMessage('Failed to update product. Please try again later');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('An error occurred while updating the product. Please try again later');
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h2>Update Product</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <input
              type="text"
              className="form-control"
              id="id"
              name="id"
              value={product.id || ''} // || operator to handle undefined values
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">name</label>
            <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name="description" value={product.description} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">Category ID</label>
            <input type="text" className="form-control" id="categoryId" name="categoryId" value={product.categoryId} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="text" className="form-control" id="price" name="price" value={product.price} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="images" className="form-label">Image</label>
            <input type="file" className="form-control" id="images" name="images" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary">Update Product</button>
          <button type="submit" className="btn btn-primary mx-5" onClick={handleShowAllBook}>Show All Books</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;