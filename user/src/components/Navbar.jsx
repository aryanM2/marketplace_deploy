import React, { useState, useEffect, useRef } from 'react'
import "./navbar.css"
import { CgProfile } from "react-icons/cg";
import ProfileDropdown from './ProfileDropdown';

import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  
  const [searchNav, setSearchNav] = useState("");
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      let firstName = loggedUser.split(" ")[0]
      if (firstName) setUserName(firstName);
    }

  }, []);
  
  return (
  <div className='box'>
    <header>

      <input id="nav-toggle" className="nav-toggle" type="checkbox" />
      <nav>
        <div className="navbar">
                   <div className='navLeft'>

                      <div className='logo'>
                        <h3>Student Marketplace</h3>
                      </div>
                    
                      <div className='search'>
                          <input  type="text" value={searchNav} onChange={(e)=>setSearchNav(e.target.value)} onKeyDown={(e)=>{ if(e.key === 'Enter'){
                            e.preventDefault();
                            const lowerCaseSearch = searchNav.toLowerCase();
                            if (lowerCaseSearch.includes("book")) navigate('/category/books');
                            else if (lowerCaseSearch.includes("note")) navigate('/category/notes');
                            else if (lowerCaseSearch.includes("electronic") || lowerCaseSearch.includes("gadget")) navigate('/category/electronics');
                            else if (lowerCaseSearch.includes("stationary")) navigate('/category/stationary');
                            else toast.error('No category found for your search term.');
                          } }} placeholder='Search Books,Notes and Gadgets..' />
                          <ToastContainer />
                      </div>

                   </div>
                  

                    
                   
          <div className='profile' ref={profileRef}>
                      
                      <h2 className='deksUserName'>{userName}</h2>
                      
                       
                        <div className="profile-icon-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <CgProfile className='icon'/>
                        </div>
                        {dropdownOpen && <ProfileDropdown />}
                    </div>
                </div>
            </nav>
        </header>
    </div>
  )
}
