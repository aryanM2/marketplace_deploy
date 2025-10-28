import React from "react";
import { Modal, Button } from "react-bootstrap";


const ContactSeller = ({ show, handleClose, item }) => {
  if (!item) return null;

  const getWhatsAppLink = (number) => {
    let cleanNumber = number.replace(/[^\d]/g, "");
    if (cleanNumber.length === 10) cleanNumber = "91" + cleanNumber; 
    return `https://wa.me/${cleanNumber}?text=Hi!%20I'm%20interested%20in%20your%20item.`;
  };

  const contactLink =
    item.contactMethod === "whatsapp"
      ? getWhatsAppLink(item.contactInfo)
      : `mailto:${item.contactInfo}?subject=Interested%20in%20your%20listing`;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Contact Seller</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <h5 className="fw-bold mb-2">{item.itemName}</h5>
        <p>
          Contact Type:{" "}
          <span className="text-capitalize fw-semibold">
            {item.contactMethod}
          </span>
        </p>

       <a
          href={contactLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn ${
            item.contactMethod === "whatsapp" ? "btn-success" : "btn-primary"
          } w-75`}
        >
          {item.contactMethod === "whatsapp" ? "Chat on WhatsApp" : "Send Email"}
        </a>
        
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactSeller;
