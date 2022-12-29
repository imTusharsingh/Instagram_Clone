import React, { useEffect, useState, useContext } from 'react'
import "./hero.css"
import Mainnav from './mainnav'
import Stauts from './stauts'
import { useHistory, Link } from 'react-router-dom';
import { Usercontext } from '../App'
import { useCookies } from 'react-cookie'
import { Avatar } from '@mui/material';



const Hero = () => {
    const history = useHistory();
    const [allPost, setallPost] = useState([]);
    const [storeonlineuser, setstoreonlineuser] = useState();
    const [storeonlinename, setstoreonlinename] = useState();
    const [commentbyuser, setcommentbyuser] = useState();
    const [commentId, setcommentId] = useState()
    const [suggestiondata, setsuggestiondata] = useState();
    const [show, setshow] = useState(3);
    const [cid, setcid] = useState();
    const [cookies, removeCookie] = useCookies();
    const { state, dispatch } = useContext(Usercontext)



    const logout = async () => {
        fetch('https://instagramcloneapi-9613.onrender.com/signout', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then((res) => {
            history.push('/login');
            localStorage.removeItem('user')
            dispatch({ type: "USER", payload: null })
        })



    }

    const callPost = async () => {
        try {
            const res = await fetch('https://instagramcloneapi-9613.onrender.com/followedpost', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const data = await res.json();

            const { followedpost, onlineuser, onlinename } = data;
            console.log(followedpost)
            setallPost(followedpost);
            setstoreonlineuser(onlineuser);
            setstoreonlinename(onlinename);

            if (res.status === 401) {
                logout();
            }

            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }

        } catch (err) {
            console.log(err);
        }
    }

    const like = async (post_Id) => {

        try {
            const res = await fetch('https://instagramcloneapi-9613.onrender.com/checklikes', {
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
                    callPost()
                });

        } catch (err) {
            console.log(err);

        }
    }

    const deletePost = async (public_id) => {
        try {
            console.log("enter front delete")
            const res = await fetch('https://instagramcloneapi-9613.onrender.com/deletepost', {
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
                    callPost()
                });
        } catch (e) {
            console.log(e)
        }
    }

    const commentload = async (post_id, commentbyuser) => {
        try {
            const res = await fetch('https://instagramcloneapi-9613.onrender.com/comment', {
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

            callPost()
            setcommentbyuser("")
            setcommentId("")

        } catch (err) {
            console.log(err)
        }
    }

    const suggestions = async () => {
        try {
            const res = await fetch('https://instagramcloneapi-9613.onrender.com/suggestion', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });


            const data = await res.json();
            (data) && setsuggestiondata(data);

            console.warn(suggestiondata)

            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }

        } catch (err) {
            console.log(err);
        }
    }

    const checkFollow = async (username, usernameid) => {
        try {
            const res = await fetch('https://instagramcloneapi-9613.onrender.com/follow', {
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

            suggestions();



            console.log(data);

        } catch (err) {
            console.log(err);
        }
    }

    const funshow = (length, id) => {
        setshow(length);
        setcid(id);
    }

    useEffect(() => {
        callPost();
        suggestions();

    }, [])

    useEffect(() => {
        if (!cookies.jwttoken) {
            logout();
        }

    }, [cookies.jwttoken])

    const settingcommentbyuser = (id, e) => {

        setcommentId(id)
        setcommentbyuser(e.target.value)
    }


    return (
        <div>

            <Mainnav />

            <div className="two_section">
                <div className="first"></div>
                <div className="left_section">

                    <Stauts />



                    <div className="allposts">
                        {allPost.length == 0 ?
                            <>
                                <div className="nopostavailabewrapper">
                                    <h1 className="notpostavailable">NO POST AVAILABLE!</h1>
                                    <h4>FOLLOW USERS OR VISIT ALLPOSTS <i className="nav_icon far fa-compass"></i></h4>
                                </div>
                            </> :
                            <>
                                {allPost.slice(0).reverse().map(currElem => {

                                    return (
                                        <>

                                            <div className="post_section" key={currElem._id}>


                                                <div className="post_header">
                                                    <div className="post_headerleft">

                                                        <Avatar alt={currElem.postedBy.username} src={currElem.postedBy.profileImage.image} style={{ width: "2.5rem", height: "2.5rem", fontSize: "1.5rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginLeft: "1rem", marginRight: ".7rem" }} />
                                                        <h2 ><Link to={`/profile/${currElem.postedBy.username}`} style={{ textDecoration: "none", color: "black" }}>{currElem.postedBy.username}</Link></h2>
                                                    </div>
                                                    {(state.username == currElem.postedBy.username) &&
                                                        <button onClick={() => deletePost(currElem.posts.public_id)}>delete</button>}
                                                </div>

                                                <div className="post">
                                                    {(currElem.posts.posttype == "image") && <img className="post_image" src={currElem.posts.post} alt="" />}
                                                    {(currElem.posts.posttype == "video") && <video className="post_image" src={currElem.posts.post} alt="" autoPlay loop muted />}

                                                </div>

                                                <div className="post_bottom">
                                                    <div className="react">


                                                        {currElem.likes.includes(storeonlineuser) ? <i className="react_icon fas fa-heart" onClick={() => like(currElem._id)}></i> : <i className="react_icon far fa-heart" onClick={() => like(currElem._id)}></i>}

                                                        {(show == 3) ?
                                                            <i className="react_icon far fa-comment" onClick={() => funshow(currElem.comments.length, currElem._id)}></i> :
                                                            <>
                                                                {(cid == currElem._id) ? <i className="react_icon fas fa-comment" ></i> :
                                                                    <i className="react_icon far fa-comment" onClick={() => funshow(currElem.comments.length, currElem._id)}></i>}
                                                            </>}

                                                    </div>
                                                    <div className="views">
                                                        <h2 ><strong>{currElem.likes.length}</strong> likes</h2>
                                                    </div>
                                                    {(show == 3) ?
                                                        <button className="all_comment" onClick={() => funshow(currElem.comments.length, currElem._id)}
                                                            style={{ background: "transparent", border: "none", cursor: "pointer", outline: "none" }}>
                                                            View {currElem.comments.length} comments
                                                        </button> : <>
                                                            {(cid == currElem._id) ? <button className="all_comment" onClick={() => setshow(3)}
                                                                style={{ background: "transparent", border: "none", cursor: "pointer", outline: "none" }}>
                                                                Hide comments
                                                            </button> : <button className="all_comment" onClick={() => funshow(currElem.comments.length, currElem._id)}
                                                                style={{ background: "transparent", border: "none", cursor: "pointer", outline: "none" }}>
                                                                View {currElem.comments.length} comments
                                                            </button>}</>
                                                    }

                                                    <div className="comments">


                                                        {currElem.comments.slice(0).reverse().map((elem, index) => {
                                                            return (
                                                                <>
                                                                    {(cid == currElem._id) ? <>
                                                                        <div key={elem._id} className={(index < show) ? "comment" : "comment deactive"}>
                                                                            <Avatar alt={elem.commentedBy.username} src={elem.commentedBy.profileImage.image} style={{ width: "1.8rem", height: "1.8rem", fontSize: "1rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginRight: ".5rem" }} />
                                                                            <h2>{elem.commentedBy.username}</h2>
                                                                            <span>{elem.commentbyuser}</span>
                                                                        </div>
                                                                    </> :
                                                                        <>
                                                                            <div key={elem._id} className={(index < 3) ? "comment" : "comment deactive"}>
                                                                                <Avatar alt={elem.commentedBy.username} src={elem.commentedBy.profileImage.image} style={{ width: "1.8rem", height: "1.8rem", fontSize: "1rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginRight: ".5rem" }} />
                                                                                <h2>{elem.commentedBy.username}</h2>
                                                                                <span>{elem.commentbyuser}</span>
                                                                            </div>
                                                                        </>}


                                                                </>
                                                            )
                                                        })}

                                                    </div>
                                                </div>



                                                <div className="postfooter">
                                                    <i className="footer_icon far fa-smile" style={{ opacity: 0.2, cursor: "default" }}></i>
                                                    <input type="text" placeholder="Add a comment" value={(commentId == currElem._id) ? commentbyuser : ""} onChange={(e) => settingcommentbyuser(currElem._id, e)} />
                                                    {(commentbyuser) ? <p className="comment_post_btn active" onClick={() => commentload(currElem._id, commentbyuser)} >Post</p> :
                                                        <p className="comment_post_btn">Post</p>}

                                                </div>

                                            </div>
                                        </>)
                                })}
                            </>
                        }



                    </div>
                </div>
                <div className="right_section">
                    <div className="top_right">

                        <div className="user_info">
                            <Avatar alt={state.username} src={state.image} style={{ width: "4.5rem", height: "4.5rem", fontSize: "2.8rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginLeft: "1rem", marginRight: "1rem" }} />
                            <Link className="goprofile" to={`/profile/${storeonlineuser}`}>
                                <div className="username_info">
                                    <h2 className="username">{storeonlineuser}</h2>
                                    <h2 className="name">{storeonlinename}</h2>
                                </div>
                            </Link>
                        </div>
                        <button className="switch_account" onClick={() => logout()}>Log Out</button>
                    </div>

                    <div className="suggestion_info">
                        <div className="suggestion_header">
                            <h2>Suggestions For You</h2>
                            {/* <span>See All</span> */}
                        </div>
                        {(suggestiondata) && suggestiondata.map(elem => {
                            return (
                                <>
                                    <div className="suggested_member">
                                        <div className="member">

                                            <Avatar alt={elem.username} src={elem.profileImage.image} style={{ width: "2.5rem", height: "2.5rem", fontSize: "1.5rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginLeft: "1rem", marginRight: ".7rem" }} />

                                            <div className="member_info">
                                                <Link to={`/profile/${elem.username}`} style={{ textDecoration: "none" }}>
                                                    <h2 className="memberusername">{elem.username}</h2>
                                                </Link>
                                                <span className="follow_info">{elem.info}</span>

                                            </div>

                                        </div>
                                        {(elem.info == "follows you" || elem.info == "new user") ? <button className="follow" onClick={() => checkFollow(elem.username, elem._id)}>Follow</button> : <button className="follow" style={{ color: "darkGray" }} onClick={() => checkFollow(elem.username, elem._id)} >Following</button>}

                                    </div>
                                </>
                            )
                        })

                        }


                        <div className="right_footer">

                            <ul className="top">
                                <li><a href="#">About</a></li>
                                <li> <a href="#">Help</a></li>
                                <li><a href="#">Press</a></li>
                                <li><a href="#">API</a></li>
                                <li><a href="#">jobs</a></li>
                                <li><a href="#">Privacy</a></li>
                                <li><a href="#">Terms</a></li>
                                <li><a href="#">Locations</a></li>

                            </ul>
                            <ul className="middle">
                                <li> <a href="#">Top Accounts</a></li>
                                <li><a href="#">Hastags</a></li>
                                <li><a href="#">Language</a></li>
                            </ul>
                            <div className="bottom">
                                <h5>© 2021 INSTAGRAM FROM FACEBOOK</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fourth"></div>
            </div>


        </div >
    )
}

export default Hero
