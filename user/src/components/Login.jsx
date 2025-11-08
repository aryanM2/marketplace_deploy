import React, { useState } from 'react'
import './landing.css';
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';


export default function Login() {
    const navigate = useNavigate();
    let [loginInput,setLoginInput] = useState({
        email:"",
        password:"",
    })

    let getValue=(e)=>{
        let inputName = e.target.name;
        let inputValue = e.target.value;
        let currentData ={...loginInput};
        currentData[inputName]= inputValue;
        setLoginInput(currentData);

    }

    let doLogin=(e)=>{
        e.preventDefault();
        const API = process.env.REACT_APP_BACKEND_URL;
        axios.post(`${API}/login`, loginInput)
        .then((res)=>{
            const sdata = res.data || {};
      
            if (sdata.jwtToken) {
                localStorage.setItem('jwtToken', sdata.jwtToken);
               
                localStorage.setItem('loggedUser', sdata.name || sdata.email || '');
                 toast.success("login succesfull")
               
                    setTimeout(() => {
                        
                          navigate('/home');
                    }, 1200);
                 
               
            } else if (sdata.status === 1) {
              
                navigate('/home');
            } else {
                toast.error(sdata.msg || 'Login failed');
            }
        })
        .catch(err => {
            console.error('login error', err.response ? err.response.data : err.message);
            toast.error(err.response?.data?.msg || 'Login failed');
        });
    }





  return (
    <div className="login-container">
        <div className='login-box'>
            <h2>Login</h2>
            <form onSubmit={doLogin}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={loginInput.email} onChange={getValue} placeholder="you@example.com" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password"  value={loginInput.password} onChange={getValue} id="password" name="password" required />
                </div>
                <button type="submit" className="login-btn">Login</button>
                <ToastContainer />
            </form>
          
            <div className="signup-link">
                <p>Don't have an account? <Link to={"/signup"}>SignUp</Link> </p>
            </div>
        </div>
    </div>
  )
}
