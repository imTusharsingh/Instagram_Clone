import React, { useState } from 'react'
import "./signup.css"
import { NavLink ,useHistory} from 'react-router-dom'

const Signuppage = () => {
    const history=useHistory();
    const [user, setUser] = useState({
        email: "", username: "", name: "", password: ""
    });


    const handleInputs = (e) => {
        let { name, value } = e.target;
        setUser({ ...user, [name]: value });

    }

    const postData = async (e) => {
        try {
            e.preventDefault();

            const { email, name, username, password } = user;

            const res = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    name,
                    username,
                    password
                })

            });
            const data =await res.json();
            if(res.status===422 || !data){
                window.alert("Please! fill all the data")
            }
            if(res.status===423){
                window.alert("User areday exits")
            }
            if(res.status===424){
                window.alert("User-Name areday exits")
            }
            if(res.status===500){
                window.alert("Failed to Register")
            }
            if(res.status===201){
                window.alert("Registered Succesfully")
                history.push("/login")
            }

        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <>

            <div className="signup_container">
                <div className="phone_container">
                    <img className="login1" src="./images/login1.png" alt="" />
                    <img className="login2" src="./images/login2.png" alt="" />
                </div>
                <div className="right_container">
                    <div className="signupformwrapper">
                        <div className="form_container">
                            <div className="logo_container"><img src="/images/logo.png" alt="" /></div>
                            <h4>Sign up to see photos and videos from your friends.</h4>
                            <button className="signupfacebookConatiner">
                                <i className="fab fa-facebook-square"></i>
                                <h3>Log in with Facebook</h3>
                            </button>
                            <p>OR</p>
                            <input type="text" name="email" value={user.email} onChange={handleInputs} placeholder="Mobile Number,or Email" />
                            <input type="text" name="name" value={user.name} onChange={handleInputs} placeholder="Full Name" />
                            <input type="Username" name="username" value={user.username} onChange={handleInputs} placeholder="Username" />
                            <input type="password" name="password" value={user.password} onChange={handleInputs} placeholder="Password" />
                            <button name="signup" type="submit" onClick={postData}>Sign up</button>
                            <span className="termsline">
                                By signing up,you agree to our
                            </span>
                            <div className="linklist">
                                <div className="toplink">
                                    <a href=""><strong>Terms ,</strong></a>
                                    <a href=""><strong> Data Policy</strong></a>
                                    <h5> and</h5>
                                    <a className="lastlink" href=""><strong> Cookies</strong></a>
                                </div>
                                <div className="bottomlink">
                                    <a href=""><strong>Policy .</strong></a>
                                </div>

                            </div>

                        </div>
                        <div className="login">
                            <p>Have an account?
                                <NavLink className="strong" to="/login"> Log in</NavLink>
                            </p>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}

export default Signuppage
