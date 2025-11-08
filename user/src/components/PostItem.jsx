import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Navbar from "./Navbar";
import "./post.css"
import Footer from "./Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";





const PostItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    condition: "",
    price: "",
    negotiable: false,
    name: "",
    city: "",
    contactMethod: "",
    contactInfo: "",
    tags: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      console.log('file input changed, number of files:', files.length);
    }
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('condition', formData.condition);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('contactMethod', formData.contactMethod);
    data.append('contactInfo', formData.contactInfo);
    data.append('tags', formData.tags);

  
    
    if (formData.images && formData.images.length) {
      for (let i = 0; i < formData.images.length; i++) {
 
        data.append('images', formData.images[i]);
      }
    }

    const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/post-item-data`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => {
     
        toast.success("item is posted successfully")

        setTimeout(() => {
           navigate('/home');
          
        }, 1000);
       
        
      })
      .catch((err) => {
        console.error(err);
        toast.error("failed to post try again")
      });
  };

  return (
    <>
    <Navbar/>
    <Container className="box mb-5 headBox" style={{ maxWidth: "840px" }}>
       <ToastContainer/>
      <h2 className="text-center mb-4 fw-bold postTitle">Post an Item</h2>
      <Form className="post-form" onSubmit={handleSubmit}>

  
        <Form.Group className="mb-3">
          <Form.Label>Item Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="e.g. Physics Textbook or HP Laptop"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

     
        <Row>
          <Col md={6}>

            <Form.Group className="mb-3">

              <Form.Label>Name</Form.Label>

              <Form.Control

                type="text"

                name="name"

                placeholder="enter your name.."

                value={formData.name}

                onChange={handleChange}

                required

              />

            </Form.Group>

          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="used">Used</option>
                <option value="needs-repair">Needs Repair</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="e.g. 500"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              label="Negotiable"
              name="negotiable"
              checked={formData.negotiable}
              onChange={handleChange}
            />
          </Col>
        </Row>

        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={4}
            placeholder="Describe the item condition, features, or other details..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

   
        <Row>
          
    <Col md={6}>

            <Form.Group className="mb-3">

              <Form.Label>Category</Form.Label>

              <Form.Select

                name="category"

                value={formData.category}

                onChange={handleChange}

                required

              >

                <option value="">Select Category</option>

                <option value="books">Books</option>

                <option value="electronics">Electronics</option>

                <option value="notes">Notes</option>

                <option value="stationary">Stationary</option>

           

              </Form.Select>

            </Form.Group>

          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="e.g. Delhi"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact Method</Form.Label>
              <Form.Select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control
                type="text"
                name="contactInfo"
                placeholder="e.g. email or phone number"
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

   
        <Form.Group className="mb-3">
          <Form.Label>Tags (comma separated)</Form.Label>
          <Form.Control
            type="text"
            name="tags"
            placeholder="e.g. laptop, study, used"
            value={formData.tags}
            onChange={handleChange}
          />
        </Form.Group>

    
        <Form.Group className="mb-4">
          <Form.Label>Upload Images</Form.Label>
          <Form.Control
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            required
          />
        </Form.Group>

       
        <div className="text-center">
          <Button className="login-btn" variant="primary" type="submit" size="lg">
            Post Item
          </Button>
         
        </div>
      </Form>
    </Container>

     <Footer/>
    </>
  );
};

export default PostItem;
