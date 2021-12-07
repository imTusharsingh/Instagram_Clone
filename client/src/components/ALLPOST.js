import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useHistory, Link } from 'react-router-dom';
import "./ALLPOST.css"
import Mainnav from './mainnav'
import { Avatar } from '@mui/material';

const ALLPOST = () => {

    const [allPost, setallPost] = useState([]);
    // const [check, setcheck] = useState([]);
    const [storeonlineuser, setstoreonlineuser] = useState();
    const [storeonlinename, setstoreonlinename] = useState();
    const [commentbyuser, setcommentbyuser] = useState();
    const [show, setshow] = useState(3);
    const [cid,setcid] = useState();


    const [commentId, setcommentId] = useState()


    const callAllPost = async () => {
        try {
            const res = await fetch('/allpost', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const data = await res.json();

            const { allpost, onlineuser, onlinename } = data;
            console.log(data)
            setallPost(allpost);
            setstoreonlineuser(onlineuser);
            setstoreonlinename(onlinename);



            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }

        } catch (err) {
            console.log(err);
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
                    callAllPost()
                });
        } catch (e) {
            console.log(e)
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
                    callAllPost()
                });

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
            // const data = await res.json();
            // setstorecommentsdata(data)
            callAllPost()
            setcommentbyuser("")
            setcommentId("")
            // console.log(storecommentsdata)
        } catch (err) {
            console.log(err)
        }
    }

    const funshow=(length,id)=>{
        setshow(length);
        setcid(id);
    }

    const settingcommentbyuser = (id, e) => {

        setcommentId(id)
        setcommentbyuser(e.target.value)
    }

    useEffect(() => {
        callAllPost();
       
    }, [])

    return (
        <>
            <Mainnav />
            <div className="allpostgrid">
                <div></div>
            <div className="allallposts">

                {allPost.length == 0 ?
                    <>
                        <div className="allnopostavailabewrapper">
                            <h1 className="allnotpostavailable">NO POST AVAILABLE!</h1>
                           
                        </div>
                    </> :
                    <>
                        {allPost.slice(0).reverse().map(currElem => {

                            return (
                                <>

                                    <div className="allpost_section" key={currElem._id}>


                                        <div className="allpost_header">
                                            <div className="allpost_headerleft">
                                                <Avatar alt={currElem.postedBy.username} src={currElem.postedBy.profileImage.image} style={{ width: "2.5rem", height: "2.5rem", fontSize: "1.5rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginLeft: "1rem", marginRight: ".7rem" }} />
                                                <h2 ><Link to={`/profile/${currElem.postedBy.username}`} style={{ color: 'black',textDecoration:"none" }}>{currElem.postedBy.username}</Link></h2>
                                            </div>
                                            {(storeonlineuser == currElem.postedBy.username) &&
                                                <button onClick={() => deletePost(currElem.posts.public_id)}>delete</button>}
                                        </div>

                                        <div className="allpost">
                                            {(currElem.posts.posttype == "image") && <img className="allpost_image" src={currElem.posts.post} alt="" />}
                                            {(currElem.posts.posttype == "video") && <video className="allpost_image" src={currElem.posts.post} alt="" autoPlay loop muted />}

                                        </div>

                                        <div className="allpost_bottom">
                                            <div className="allreact">


                                                {currElem.likes.includes(storeonlineuser) ? <i className="allreact_icon fas fa-heart" onClick={() => like(currElem._id)}></i> : <i className="allreact_icon far fa-heart" onClick={() => like(currElem._id)}></i>}
                                         
                                                {(show == 3) ?
                                                           <i className="allreact_icon far fa-comment" onClick={ ()=>funshow(currElem.comments.length,currElem._id)}></i>:
                                                           <>
                                                            {(cid==currElem._id)? <i className="allreact_icon fas fa-comment" ></i>:
                                                             <i className="allreact_icon far fa-comment" onClick={ ()=>funshow(currElem.comments.length,currElem._id)}></i>}
                                                             </>}

                                            </div>
                                            <div className="allviews">
                                                <h2 ><strong>{currElem.likes.length}</strong> likes</h2>
                                            </div>

                                            {(show == 3) ?
                                                        <button className="allall_comment" onClick={() => funshow(currElem.comments.length,currElem._id)}
                                                        style={{background:"transparent",border:"none",cursor:"pointer",outline:"none"}}>
                                                            View {currElem.comments.length} comments
                                                        </button> :<>
                                                        {(cid==currElem._id)? <button className="allall_comment" onClick={() => setshow(3)}
                                                        style={{background:"transparent",border:"none",cursor:"pointer",outline:"none"}}>
                                                            Hide comments
                                                        </button>:<button className="allall_comment" onClick={() => funshow(currElem.comments.length,currElem._id)}
                                                        style={{background:"transparent",border:"none",cursor:"pointer",outline:"none"}}>
                                                            View {currElem.comments.length} comments
                                                        </button>}</>
                                                       }
                                           

                                            <div className="allcomments">


                                                {currElem.comments.slice(0).reverse().map((elem,index) => {
                                                    return (
                                                        <>
                                                         {(cid==currElem._id)?<>
                                                                    <div key={elem._id}className={(index < show) ? "allcomment" : "allcomment deactive"}>
                                                                        <Avatar alt={elem.commentedBy.username} src={elem.commentedBy.profileImage.image} style={{ width: "1.8rem", height: "1.8rem", fontSize: "1rem", fontWeight: "bolder", background: "rgb(37,37,37)", textTransform: "capitalize", marginRight: ".5rem" }} />
                                                                        <h2>{elem.commentedBy.username}</h2>
                                                                        <span>{elem.commentbyuser}</span>
                                                                    </div>
                                                                </>:
                                                                <>
                                                                 <div key={elem._id} className={(index < 3) ? "allcomment" : "allcomment deactive"}>
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



                                        <div className="allpostfooter">
                                            <i className="allfooter_icon far fa-smile"></i>
                                            <input type="text" placeholder="Add a comment" value={(commentId == currElem._id) ? commentbyuser : ""} onChange={(e) => settingcommentbyuser(currElem._id, e)} />
                                            {(commentbyuser) ? <p className="allcomment_post_btn active" onClick={() => commentload(currElem._id, commentbyuser)} >Post</p> :
                                                <p className="allcomment_post_btn">Post</p>}

                                        </div>

                                    </div>
                                </>)
                        })}
                    </>
                }



            </div>
            <div></div>
            </div>

        </>
    )
}

export default ALLPOST

