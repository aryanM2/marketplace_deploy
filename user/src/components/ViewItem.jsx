import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./ViewItem.css"
import Navbar from "./Navbar";
import axios from "axios";
import ContactSeller from "./contact";
import Footer from "./Footer";


const ViewItem = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
    const API = process.env.REACT_APP_BACKEND_URL;
    axios.get(`${API}/view-item/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        if (res.data && res.data.status === 1) {
          setItem(res.data.data);
        } else {
          setError(res.data?.msg || 'Item not found');
        }
      })
      .catch((err) => {
        console.error('Failed to get data', err);
        setError(err.response?.data?.msg || err.message || 'Fetch error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="box">
        <Navbar />
        <Container className="mt-5 text-center">Loading...</Container>
      </div>
    );

  if (error)
    return (
      <div className="box">
        <Navbar />
        <Container className="mt-5 text-center">Error: {error}</Container>
      </div>
    );

  return (
    <div className="box">
      <Navbar />

      <Container className="mt-5 itembox">
        <h1 className="titleView">View Item</h1>

        <Card className="shadow-sm p-3 viewedCard">
          <Row>
            <Col md={6}>
                  {item.images && item.images.length > 0 ? (
                    <Card.Img
                      src={
                        item.images[0].path.startsWith("http")
                          ? item.images[0].path
                          : `${process.env.REACT_APP_BACKEND_URL}/${item.images[0].path}`
                      }
                      alt={item.itemName || "Item image"}
                      className="viewdImg rounded"
                    />
                  ) : (
                    <Card.Img
                      src="https://via.placeholder.com/400x300?text=No+Image+Available"
                      alt="No Image Available"
                      className="viewdImg rounded"
                    />
                  )}
            </Col>

            <Col md={6}>
              <Card.Body className="viewedBody">
                <Card.Title className="fs-4 fw-bold mb-2">{item.itemName}</Card.Title>
                <h5 className="text-success mb-3">₹{item.price}</h5>
                <p>
                  <strong>Name</strong> {item.name}
                </p>
                <p><strong>Description: </strong>     { item.description}</p>
                <div className="contactbtn">
                  <button onClick={() => setShowModal(true)}>Message Seller</button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
      
       <ContactSeller
        show={showModal}
        handleClose={() => setShowModal(false)}
        item={item}
      />
      <Footer/>
    </div>
  );
};

export default ViewItem;
