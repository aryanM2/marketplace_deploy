import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useState } from 'react'
import { useEffect } from 'react'
import Items from './Items'

export default function Home() {
  const[LoggedInUser,setLoggedInUser] = useState("");
  useEffect(()=>{
    
    setLoggedInUser(localStorage.getItem("loggedUser")) 
  
  })




  return (
    <div>
      
      <Navbar />
      <Items name={LoggedInUser}/> 
       <Footer/>

        
    </div>
  )
}
