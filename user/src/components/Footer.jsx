import React from 'react'
import "./Footer.css"
import { Col, Container, Row } from 'react-bootstrap'


export default function Footer() {
  return (
    
        <footer style={{ backgroundColor: "#1E293B", color: "#ccc", marginTop: "60px" }}>
      <Container className="py-5">
        <Row>
       
          <Col md={4} className="mb-4">
            <h5 className="text-white mb-3">Student Marketplace</h5>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              A campus-based marketplace where students can buy, sell, and exchange
              notes, gadgets, and books — all in one place.
            </p>
          </Col>

         
          <Col md={4} className="mb-4">
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled" style={{ fontSize: "14px" }}>
              <li><a href="/home" className="text-decoration-none text-light">Home</a></li>
              <li><a href="/post-item" className="text-decoration-none text-light">Post Item</a></li>
              <li><a href="/my-post" className="text-decoration-none text-light">My Posts</a></li>
            
            </ul>
          </Col>

         
          <Col md={4} className="mb-4">
            <h5 className="text-white mb-3">Contact</h5>
            <p style={{ fontSize: "14px" }}>
              Email:{" "}
              <a href="mailto:aryanmalwa07@gmail.com" className="text-decoration-none text-light">
                aryanmalwa07@gmail.com
              </a>
            </p>
            <p style={{ fontSize: "14px" }}>Location: Delhi, India</p>
            <div className="d-flex gap-3 mt-3">
              

              <a href="https://www.linkedin.com/in/aryan-malwa/"  target="_blank" className="text-light text-decoration-none">LinkedIn</a>

              <a href="https://aryanportfolio.kesug.com/" target="_blank" className="text-light text-decoration-none">Portfolio</a>

              <a href="https://www.instagram.com/aryan21_s?igsh=MWlpc2VraWpmN3UyNA=="   target="_blank" className="text-light text-decoration-none">Instagram</a>

              
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "#444" }} />
        <div className="text-center py-2" style={{ fontSize: "13px" }}>
          © {new Date().getFullYear()} Student Marketplace | All Rights Reserved
        </div>
      </Container>
    </footer>
      

  )
}
