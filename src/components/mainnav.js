import React, { useState, useEffect, useContext } from 'react'
import { Usercontext } from '../App'
import "./mainnav.css"
import { NavLink, useHistory } from 'react-router-dom'

const Mainnav = () => {
    const history = useHistory();
    const [toggleButton, setToggleButton] = useState(false)
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [post, setPost] = useState("");
    const [posttype, setPosttype] = useState("");
    const [public_id, setpublic_id] = useState("");
    const [storeonlineuser, setstoreonlineuser] = useState();
    const { state, dispatch } = useContext(Usercontext)
    const toggle = () => {
        setToggleButton(!toggleButton)
    }








    const Post_postData = async () => {
        try {

            const res = await fetch("https://instagramcloneapi-9613.onrender.com/addpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post,
                    caption,
                    posttype,
                    public_id
                })
            });
            const data = await res.json();
            if (res.status === 422) {
                window.alert("Please Add The Post")
            }
            else if (res.status === 500) {
                window.alert("Post faield")
            }
            else if (res.status === 201) {
                window.alert("Post added")

            }
            else {
                window.alert("post failed")
            }
            toggle();
        }
        catch (err) {
            console.log(err);
        }

    }

    const uploadImage = async () => {

        try {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "instagramimages");

            const options = {
                method: "POST",
                body: formData
            };


            const res = await fetch("https://api.cloudinary.com/v1_1/instadata/image/upload", options);
            const response = await res.json();

            const { secure_url, resource_type, public_id } = response;

            setPost(secure_url);
            resource_type && setPosttype(resource_type);
            public_id && setpublic_id(public_id)


        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (post) {
            Post_postData();
        }
    }, [post && posttype && public_id])
    return (

        <>
            <div className="hero_container">
                <nav>
                    <div></div>
                    <div className="logo_container"><img src="/images/logo.png" alt="" /></div>
                    <div className="rightnav">
                        <div className="search_container">
                            <i className="fas fa-search"></i>
                            <input className="main_search" type="text" placeholder={` Search`} />
                        </div>

                        <NavLink to="/"> <i className="nav_icon fas fa-home"></i></NavLink>
                        <i className="nav_icon fab fa-facebook-messenger" style={{ cursor: "default", opacity: "0.3" }}></i>
                        <i className="nav_icon fas fa-plus-square" onClick={toggle}></i>
                        <NavLink to="/allpost"><i className="nav_icon fas fa-compass" ></i></NavLink>
                        <i className="nav_icon fas fa-heart" style={{ cursor: "default", opacity: "0.3" }}></i>
                        <NavLink to={(state) && `/profile/${state.username}`}><i className="nav_icon fas fa-user-circle"></i></NavLink>
                    </div>
                    <div></div>
                </nav>
            </div>

            <div className={toggleButton ? "addpost_container active" : "addpost_container"} id="add_post">
                <strong>ADD POST</strong>
                <div className="addpost_wrapper">
                    {/* <input type="file" placeholder="Select the image"  name="post"  value={post} onChange={(e)=>setPost(e.target.value)} /> */}
                    <input type="file" placeholder="Select the image" onChange={(e) => setImage(e.target.files[0])} />

                    <input type="text" placeholder="Add the caption.." name="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
                    <button type="submit" onClick={() => uploadImage()}>Submit</button>
                </div>
            </div>
            <div className={toggleButton ? "overlay active" : "overlay"} id="overlay" onClick={toggle}></div>


        </>
    )
}

export default Mainnav
