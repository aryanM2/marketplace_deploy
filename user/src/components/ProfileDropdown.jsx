import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useState } from 'react';

const ProfileDropdown = ({ onLogout }) => {
    const navigate = useNavigate();

      const [userName, setUserName] = useState('');
    
      useEffect(() => {
        const loggedUser = localStorage.getItem('loggedUser');
        if (loggedUser) {
          let firstName = loggedUser.split(" ")[0]
          if (firstName) setUserName(firstName);
        }
    
      }, []);



    const handleLogout = () => {

        localStorage.removeItem('jwtToken');
        localStorage.removeItem('token');
        localStorage.removeItem('loggedUser');
        toast.success("logout successfully")
        setTimeout(() => {
            
            navigate('/');
        }, 1200);
        
        
    };

    return (
        <div className="profile-dropdown">
            <ToastContainer/>
            <ul className="dropdown-list">
                <li className='dropdownUserName'><h3>{userName}</h3></li>
                <li className='dropdownUserName'><hr className="dropdown-divider" /></li>
                <li><Link to="/home" className="dropdown-link">Home</Link></li>
                <li><Link to="/my-post" className="dropdown-link" >My Posts</Link></li>
                <li><Link to="/post-item" className="dropdown-link" >Post Item</Link></li>
                <li><Link to={"/category/books"} className="dropdown-link"> Books</Link></li>
                <li><Link to={"/category/notes"} className="dropdown-link">Notes</Link></li>
                <li><Link to={"/category/electronics"} className="dropdown-link">Electronics</Link></li>
                <li><Link to={"/category/stationary"} className="dropdown-link"> Stationary</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </ul>
        </div>
    );
};

export default ProfileDropdown;