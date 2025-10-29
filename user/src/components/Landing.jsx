import React from 'react'
import "./landing.css";
import { Card, Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';




export default function Landing() {
       const [post, setPost] = useState([]);
       const [search,setsearch] = useState("");
       let navigate = useNavigate()

       let handlesearch=(e)=>{
                e.preventDefault();
            const lowerCaseSearch = search.toLowerCase();
            if (lowerCaseSearch.includes("book")) {
                     navigate("/category/books");

            } 
            else if (lowerCaseSearch.includes("note")) {
                     navigate("/category/notes");
            } 

            else if (lowerCaseSearch.includes("electronic") || lowerCaseSearch.includes("gadget")) {
                     navigate("/category/electronics");
            } 
            
            else if (lowerCaseSearch.includes("stationary")) {
                    navigate("/category/stationary");
            } 
            else {
                toast.error("No category found for your search term.");
            }
            
       }
    
        useEffect(() => {
            const API = process.env.REACT_APP_BACKEND_URL;
            axios.get(`${API}api/random-view`).then((res) => {
                setPost(res.data.allItems);
            });
        }, []);

        let handlebtn=()=>{
            toast.error("login to view items")
        }
    

  return (
    <div className='box'>

        <header>
          
            <input id="nav-toggle" className="nav-toggle" type="checkbox" />
            <nav>
                <div className="navbar">
                    <div className='titleLanding'>Student Marketplace</div>
                    <label htmlFor="nav-toggle" className="nav-toggle-label" aria-hidden="true">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <div className='search'>
                        <form action="" onSubmit={handlesearch}>
                            <input  type="text" value={search} name='search' onChange={(e)=>setsearch(e.target.value)} placeholder='Search Books,Notes and Gadgets..' onKeyDown={(e)=>{ if(e.key === 'Enter'){ handlesearch(e) } }} />

                        </form>
                        
                    </div>

                    <div className='navBtns'>
                        <div className="navbar-item-dropdown">
                        <Dropdown className='dropbox'>
                            <Dropdown.Toggle  variant="success" id="dropdown-basic">
                                Categories
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handlebtn}>Books</Dropdown.Item>
                                <Dropdown.Item onClick={handlebtn}>Notes</Dropdown.Item>
                                <Dropdown.Item onClick={handlebtn}>Electronics</Dropdown.Item>
                                <Dropdown.Item onClick={handlebtn}>Stationery</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className='login'>
                       <Link className='no-link-style' to={"/login"}> <button className='loginbtn'>Login/SignUp</button></Link>
                    </div>
                    </div>
                </div>
            </nav>
        </header>

        <div className="container headBox">
            <div className='heading' >
                <h1>Buy & Sell Books, Notes, and <br />
                     Gadgets In Your College</h1>

                    <p>Save Money, Connect with Students, Fast and simple</p>
            </div>

          <a className='no-link-style' href="#latestItems"><button className='browbtn'>Start Browsing</button></a> 
            
        </div>
        

        <div className="container items" id='latestItems'>
            <h1>Latest Items</h1>
            <ToastContainer/>

            <div className="container cards">
                
                     { post.length===0 ? "currently no item available" :
                     
                     
                     post.map((item) => (
                                         <Card key={item._id} className="cardCon card">
                                         {item.images && item.images.length > 0 ? (
                                         <Card.Img className="cardImage" variant="top" src={`${process.env.REACT_APP_BACKEND_URL}${item.images[0].url}`} alt={item.itemName} />
                                         ) : (
                                         <Card.Img className="cardImage" variant="top" src="https://via.placeholder.com/300x180?text=No+Image" alt="No Image" />
                                         )}
                                         <Card.Body>
                                         <Card.Title>{item.itemName}</Card.Title>
                                         
                                        <button onClick={handlebtn} className='cardbtnL'>view</button>
                                         </Card.Body>
                                         </Card>
                                         ))}
            </div>
        </div>  

        <div className="container guide">

                <h1>How it works</h1>
                <div className="instruction">
                    <ul>
                        <li>
                            <div className='i1'>
                                <h3>Post an Item</h3>
                                <p>Add photo and details</p>
                             </div>

                        </li>



                        <li>
                            <div className='i2'>
                                <h3>Browse Listing</h3>
                                <p>find what you need</p>
                            </div>
                        </li>


                        <li>
                            <div className='i3'>
                                <h3>Contact seller</h3>
                                <p>chat or whatsapp</p>
                            </div>
                            
                        </li>
                    </ul>
                    
                </div>

                <div className='post'>
                    <div className='postDesc'>
                           <b>
                            Got books or notes lying around?<br />
                             Earn money by selling them now!
                            
                            </b> 
                    </div>

                    <div className="postbtn ">
                        <button onClick={handlebtn}>Post an item</button></div>
                </div>


            </div> 

            <Footer/>
    </div>
  )
}
