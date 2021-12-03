import React, { useState ,useContext} from 'react'
import "./loginpage.css"
import { NavLink, useHistory } from 'react-router-dom'
import {Usercontext} from '../App'


const Loginpage = () => {
    const history =useHistory();
    const {state,dispatch}=useContext(Usercontext);

    const [loginData, setLoginData] = useState({
        email: "", password: ""
    })

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value })
    }

    const loginUser = async (e) => {
        try {
            e.preventDefault();
            const { email, password } = loginData;

            const res = await fetch("/signin", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            let data=await res.json();
           
            
            if(res.status===422){
                window.alert("please fill the details")
            }
            if(res.status===404){
                window.alert("User does not Exists")
            }
            if(res.status===401){
                window.alert("Wrong Email OR Password")
            }
            
            if(res.status===200){
                window.alert("Login Succesfully")
                localStorage.setItem('user',JSON.stringify(data))
               
                dispatch({type:"USER",payload:data})

              
                
                history.push("/")
            }
        }
        catch(err){
            console.log(err);
        }
       
    }
    return (
        <div>

            <div className="login_container">
                <div className="phone_container">
                    <img className="login1" src="./images/login1.png" alt="" />
                    <img className="login2" src="./images/login2.png" alt="" />
                </div>
                <div className="right_container">
                    <div className="formwrapper">
                        <div className="form_container">
                            <div className="logo_container"><img src="/images/logo.png" alt="" /></div>
                            <input type="text" name="email" value={loginData.email} placeholder="Phone number, username, or email" onChange={handleInput} />
                            <input type="password" name="password" value={loginData.password} placeholder="Password" onChange={handleInput} />
                            <button type="submit" onClick={loginUser}>Log In</button>
                            <p>OR</p>
                            <div className="facebookConatiner">
                                <i className="fab fa-facebook-square"></i>
                                <h3>Log in with Facebook</h3>
                            </div>
                            <h4>Forgot password?</h4>

                        </div>
                        <div className="signup">
                            <p>Don't have account?
                                <NavLink className="strong" to="/signup"> Sign up</NavLink>
                            </p>
                        </div>
                        <span>Get the app.</span>
                        <div className="applink">
                            <a href="https://apps.apple.com/in/app/instagram/id38980152">
                                <img className="appstore" src="./images/downloadfromappstore.jpg" alt="" />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.instagram.android">
                                <img className="playstore" src="./images/downloadfromplaystore.jpg" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Loginpage
