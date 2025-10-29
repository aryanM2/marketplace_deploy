import React from 'react'
import { Card} from 'react-bootstrap'
import {toast,ToastContainer}  from "react-toastify"
import "./category.css"
import Navbar from './Navbar'
import Footer from './Footer'

import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

export default function Category() {
    let [data,setdata] = useState([])
    
    const { type } = useParams();

   
           useEffect(() => {
                window.scrollTo(0, 0);
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/filter/${type}`).then((res)=>{
                let data = res.data.filteredData;               
           
               setdata(data)
    })}, [type])
           
         
    
   
   

  return (
    <div className="category-page">
        <Navbar/>
        <div className='container category-box headBox'>
            <h1 className="category-title">{type}</h1>
            <ToastContainer/>
            <div className="cards">
                {
                data.length > 0 ? data.map((value) => (
                        <Card key={value._id} className="cardCon card">
                        {value.images && value.images.length > 0 ? (
                        <Card.Img className="cardImage" variant="top" src={`${process.env.REACT_APP_BACKEND_URL}${value.images[0].url}`} alt={value.itemName} />
                        ) : (
                        <Card.Img className="cardImage" variant="top" src="https://via.placeholder.com/300x180?text=No+Image" alt="No Image" />
                        )}
                        <Card.Body  className='cardInfo'>
                        <Card.Title>{value.itemName}</Card.Title>
                       
                        <Link to={`/view/${value._id}`}> <button className='cardbtn'>view</button></Link>
                        </Card.Body>
                        </Card>
                    ))   
                    : 
                    <div className="no-items-message">
                        <p>No items found in this category.</p>
                    </div>
                }
            </div>
        </div>
        <Footer/>
    </div>
    
      )
}
