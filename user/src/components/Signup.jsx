import React, { useState } from 'react'
import { Link,  useNavigate } from 'react-router-dom'
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
export default function Signup() {
  

    let navigate =  useNavigate()
    
    let [registerData,SetRegisterData] = useState({
        name:"",
        email:"",
        password: "",
        confirmPass: ""
        
    });
    
    let getValue=(e)=>{
            let   inputName  = e.target.name;
            let   inputvalue = e.target.value;
            let  preData = {...registerData};
            preData[inputName]= inputvalue;
            SetRegisterData(preData);
    }

    let saveUser=(e)=>{
        e.preventDefault();
        if (registerData.password !== registerData.confirmPass) {
            toast.error("Password fields do not match");
            return;
        }
        axios.post("http://localhost:8002/register",registerData)
        .then((res)=>{
            if (res.data.status === 1) {
                toast.success("registered successfully")
                setTimeout(() => {
                   navigate("/login")
                }, 1200);
            } else {
                toast.error(res.data.msg || "Registration failed.");
            }
        })
        .catch(err => {
            toast.error(err.response?.data?.msg || "An error occurred");
        })
        .finally(() => {
            SetRegisterData({ 
                name:"",
                email:"",
                password: "",
                confirmPass: ""
                
            })
        })
    }
    
  return (
    <div className="login-container">
            <div className='login-box'>
                <h2>Sign Up</h2>
                <form onSubmit={saveUser}>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" value={registerData.name} onChange={(e)=>{getValue(e)}} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={registerData.email} onChange={(e)=>{getValue(e)}} name="email" placeholder="you@example.com" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={registerData.password} onChange={(e)=>{getValue(e)}} name="password" required />
                    </div>
                     <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" value={registerData.confirmPass} onChange={(e)=>{getValue(e)}} id="ConfirmPassword" name="confirmPass" required />
                    </div>
                    <button type="submit"  className="login-btn">Sign Up</button>
                      <ToastContainer />
                </form>
                <div className="divider">OR</div>
               
                <div className="signup-link">
                    <p>already have an account? <Link to={"/login"}>Login</Link></p>
                </div>
            </div>
        </div>
  )

}