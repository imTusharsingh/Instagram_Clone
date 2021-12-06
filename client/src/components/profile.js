import { NavLink, useHistory } from 'react-router-dom'
import React, { useState, useEffect, useContext } from 'react'
import Mainnav from './mainnav'
import "./profile.css"
import { useParams } from 'react-router'
import Stauts from './stauts'
import { Usercontext } from '../App'
import Avatar from '@mui/material/Avatar'


const Profile = () => {
    const [userpost, setuserpost] = useState([])
    const [fullpostactive, setfullpostactive] = useState(false)
    const [editimageactive, seteditimageactive] = useState(false)
    const [storeonlineuser, setstoreonlineuser] = useState();
    const [storeonlineuserid, setstoreonlineuserid] = useState();
    const [storeonlinename, setstoreonlinename] = useState();
    const [storefollowing, setstorefollowing] = useState([]);
    const [storefollowedBy, setstorefollowedBY] = useState([]);
    const [postindex, setpostindex] = useState();
    const [commentbyuser, setcommentbyuser] = useState();
    const [commentId, setcommentId] = useState();
    const [profileimage, setprofileimage] = useState()
    const [mainprofileimage, setmainprofileimage] = useState()

    const [profileimageviewer, setprofileimageviwer] = useState("/images/profilrimage.png")



    const { username } = useParams();

    const { state, dispatch } = useContext(Usercontext)



    const settingcommentbyuser = (id, e) => {

        setcommentId(id)
        setcommentbyuser(e.target.value)
    }

    const editprofile = async () => {
        try {

            const formData = new FormData();
            formData.append("file", profileimage);
            formData.append("upload_preset", "instagramimages");

            const options = {
                method: "POST",
                body: formData
            };


            const cloudres = await fetch("https://api.cloudinary.com/v1_1/instadata/image/upload", options);
            const response = await cloudres.json();

            const { secure_url, public_id } = response;

            const res = await fetch('/editprofile', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    secure_url, public_id
                }),
                credentials: "include"
            }
            )
            const data = res.json();
            if (res.status == 201) {
                window.alert("profile picture changed succesfully")
                let data={
                    email:state.email,
                    username:state.username,
                    name:state.name,
                    _id:state._id,
                    image:mainprofileimage
                    }
                    dispatch({type:"USER",payload:data})
                    localStorage.setItem('user',JSON.stringify(data))
                
                callMyPost();
            } else {
                console.log("error error")
            }

        } catch (e) {
            console.log(e)
        }

    }

    const callMyPost = async () => {
        try {
            const res = await fetch(`/mypost/${username}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const mypostdata = await res.json();

            const { finduser, findpost } = mypostdata
            const data = findpost;
            setstoreonlineuser(finduser.username);
            setstoreonlineuserid(finduser._id)
            setstoreonlinename(finduser.name);
            setstorefollowing(finduser.following);
            setstorefollowedBY(finduser.followedBy);
            setmainprofileimage(finduser.profileImage.image);
            {(finduser.profileImage.image)&& setprofileimageviwer(finduser.profileImage.image)}
           
            
            


            setuserpost(data)

        } catch (err) {
            console.log(err)
        }
    }

    const like = async (post_Id) => {

        try {

            const res = await fetch('/checklikes', {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post_Id
                })
            })
                .then(res => res.json())
                .then(result => {
                    callMyPost();
                    // setfullPostdetail(result)
                    console.log(`resullllt: ${JSON.stringify(result)}`)
                });
        } catch (err) {
            console.log(err);
            // history.push('/login')
        }
    }

    const checkFollow = async (username, usernameid) => {
        try {
            const res = await fetch('/follow', {
                method: 'put',
                headers: {
                    Accept: 'apllication/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    usernameid
                }
                )

            })

            const data = await res.json();

            callMyPost();



            console.log(data);

        } catch (err) {
            console.log(err);
        }
    }

    const commentload = async (post_id, commentbyuser) => {
        try {
            const res = await fetch('/comment', {
                method: 'put',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    post_id,
                    commentbyuser
                })
            })

            callMyPost()
            setcommentbyuser("")
            setcommentId('')

        } catch (err) {
            console.log(err)
        }
    }

    const deletePost = async (public_id) => {
        try {
            console.log("enter front delete")
            const res = await fetch('/deletepost', {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    public_id
                })
            }).then(res => res.json())
                .then(result => {
                    setfullpostactive(false)
                    callMyPost()
                });
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        callMyPost()
        
    }, [])


    const fullpost = (index) => {
        setpostindex(index);
        setfullpostactive(true);
        setcommentbyuser("")
    }

    const editprofileactive = () => {
        seteditimageactive(true);

    }

    const imageHandler =(e) =>{
        const reader =new FileReader();
            reader.onload=()=>{
                if(reader.readyState === 2){
                    setprofileimageviwer(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
            setprofileimage(e.target.files[0])
    }

    return (
        <>
            <Mainnav />

            <div className="profile_box" >
                <div className="profilehead">
                    <div></div>
                    <div className="profilemiddlegrid">
                    <div className="profilePhoto">
                        <Avatar alt="storeonlineuser" src={mainprofileimage} style={{ width: "12rem", height: "12rem", fontSize: "9rem" }} />
                    </div>
                    <div className="profile_info">
                        <div className="profile_info_top">
                            <h2>{(storeonlineuser) ? storeonlineuser : `Loading...`}</h2>
                            {(state && (state.username != storeonlineuser)) &&
                                <>
                                    {storefollowedBy.includes(state && state._id) ?
                                        <button className="Followbtn" style={{ color: "black", background: "white" }} onClick={() => checkFollow(storeonlineuser, storeonlineuserid)}>Following</button> :
                                        <button className="Followbtn" style={{ color: "white", background: "dodgerblue" }} onClick={() => checkFollow(storeonlineuser, storeonlineuserid)}>Follow</button>}
                                </>}
                            {(state && (state.username == storeonlineuser)) &&
                                <button style={{ opacity: 0.5, cursor: "default" }} onClick={() => editprofileactive()}>Edit Profile</button>}

                        </div>
                        <div className="profileinfomiddle">
                            <h2 className="post"><strong>{userpost.length}</strong> posts</h2>
                            <h2 className="followers"><strong>{storefollowedBy.length}</strong> followers</h2>
                            <h2 className="following"><strong>{storefollowing.length}</strong> following</h2>
                        </div>
                        <div className="profileinfobottom">
                            <h2>{(storeonlinename) && storeonlinename}</h2>
                        </div>
                    </div>
                    </div>
                    <div></div>
                </div>




                <div className="profilenavbar">
                    <div></div>
                    <div className="profilenavbarmiddile">
                    <div className="block">
                        <i className="fa fa-table" > POSTS</i>
                    </div>
                    <div className="block">
                        <i className="fa fa-tv" style={{ opacity: 0.5, cursor: "default" }}> IGTV</i>
                    </div>
                    <div className="block">
                        <i className="fa fa-bookmark" style={{ opacity: 0.5, cursor: "default" }}> SAVED</i>
                    </div>
                    <div className="block" style={{ opacity: 0.5, cursor: "default" }}>
                        <i className="fa fas fa-user-tag"> TAGGED</i>
                    </div>
                    </div>
                    <div></div>
                </div>

                                <div className="userpostcontainermaingrid">
                                    <div></div>
                <div className="userpostcontainer">
                    {userpost.slice(0).reverse().map((currElem, index) => {
                        return (
                            <>
                                <div className="postcard" key={currElem._id}>
                                    {(currElem.posts.posttype == "image") && <img className="post_image" src={currElem.posts.post} alt="" onClick={() => fullpost(index)} />}
                                    {(currElem.posts.posttype == "video") && <video className="post_image" src={currElem.posts.post} alt="" autoPlay loop muted onClick={() => fullpost(index)} />}
                                </div>

                                <div className={(postindex == index && fullpostactive) ? "fullpostpage active" : "fullpostpage"}>

                                    <div className="fullpostimage">
                                        {(currElem.posts.posttype == "image") && <img className="post_image" src={currElem.posts.post} alt="" />}
                                        {(currElem.posts.posttype == "video") && <video className="post_image" src={currElem.posts.post} alt="" autoPlay loop muted />}

                                    </div>
                                    <div className="rightfullpost">
                                        <div className="topfullpost">
                                            <span className="fullpostusername">{storeonlineuser}</span>

                                            {(state && (state.username != storeonlineuser)) &&
                                                <>
                                                    {storefollowedBy.includes(state && state._id) ?
                                                        <button className="Followbtn" style={{ color: "black" }} onClick={() => checkFollow(storeonlineuser, storeonlineuserid)}>Following</button> :
                                                        <button className="Followbtn" onClick={() => checkFollow(storeonlineuser, storeonlineuserid)}>Follow</button>}
                                                </>}
                                            {(storeonlineuser == currElem.postedBy.username) &&
                                                <button onClick={() => deletePost(currElem.posts.public_id)} style={{ position: "absolute", right: "1rem", background: "none", border: "none", color: "rgba(0,0,0,0.7)", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>delete</button>}
                                        </div>
                                        <div className="middlefullpost">
                                            {currElem.caption &&
                                                <div className="fullpostcaption" style={{ padding: "1rem 1rem" }}>
                                                    <Avatar alt={currElem.postedBy.username} src={currElem.postedBy.profileImage.image} style={{ fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginRight: ".5rem" }} />
                                                    <h2>{currElem.postedBy.username}</h2>
                                                    <span>{currElem.caption}</span>
                                                </div>}

                                            {currElem.comments.slice(0).reverse().map((elem) => {
                                                return (
                                                    <>
                                                        <div className="fullpostcomment" key="comment">


                                                            <Avatar alt={elem.commentedBy.username} src={elem.commentedBy.profileImage.image} style={{ fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginRight: ".5rem" }} />


                                                            <h2>{elem.commentedBy.username}</h2>
                                                            <span>{elem.commentbyuser}</span>
                                                        </div>

                                                    </>
                                                )
                                            })}
                                        </div>
                                        <div className="bottomfullpost">
                                            <div className="reactfullpost">
                                                <div className="reactlike">
                                                    {currElem.likes.includes(state && state.username) ?
                                                        <i className="reactfull_icon fas fa-heart" onClick={() => like(currElem._id)} ></i>
                                                        : <i className="reactfull_icon far fa-heart" onClick={() => like(currElem._id)}></i>}
                                                    <i className="reactfull_icon far fa-comment"></i>
                                                </div>
                                                <div className="likesfullcount">
                                                    <h2 ><strong>{currElem.likes.length}</strong> likes</h2>
                                                </div>
                                            </div>
                                            <div className="commentsectionfullpost">

                                                <i className="footerfull_icon far fa-smile"></i>
                                                {(postindex == index) ?
                                                    <input type="text" placeholder="Add a comment" value={(commentId == currElem._id) ? commentbyuser : null} onChange={(e) => settingcommentbyuser(currElem._id, e)} /> :
                                                    <input type="text" placeholder="Add a comment" />}
                                                {(commentbyuser) ? <p className="commentfull_post_btn active" onClick={() => commentload(currElem._id, commentbyuser)} >Post</p> :
                                                    <p className="commentfull_post_btn">Post</p>}

                                            </div>



                                        </div>
                                    </div>
                                </div>
                                {/* } */}
                            </>
                        )

                    })}
                </div>
                <div></div>
                </div>


                    <div className="profilefootergrid">
                    <div></div>
                <div className="profile_footer">
                    <div className="topfooter">
                        <a href="#">About</a>
                        <a href="#">Blog</a>
                        <a href="#">Jobs</a>
                        <a href="#">Help</a>
                        <a href="#">API</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Top Accounts</a>
                        <a href="#">Hastags</a>
                        <a href="#">Locations</a>
                        <a className="last" href="#">Instagram Lite</a>
                    </div>
                    <div className="bottomfooter">
                        <select name="language" id="">
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="gujarati">Gujarati</option>
                        </select>
                        <a href="#">© 2021 Instagram from Facebook</a>
                    </div>

                </div>
                <div></div>
                </div>
            </div>

            <div className={editimageactive ? "toggleeditwrapper active" : "toggleeditwrapper"}>
                <img className="editprofileimage" src={profileimageviewer} alt="" />
                {/* <input className="editprofileinput" type="file" onChange={(e) => setprofileimage(e.target.files[0])} accept="image/*" /> */}
                <input className="editprofileinput" type="file" onChange={imageHandler} accept="image/*" />
                <button className="editprofilesave" onClick={() => editprofile()}>Save</button>
            </div>





            <div className={editimageactive ? "editimageoverlay active" : "editimageoverlay"} id="overlay" onClick={() => seteditimageactive(false)} ></div>

            <div className={fullpostactive ? "fullpostoverlay active" : "fullpostoverlay"} id="overlay" onClick={() => setfullpostactive(false)} ></div>
        </>
    )
}

export default Profile
