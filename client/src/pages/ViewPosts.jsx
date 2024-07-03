import React, { useState,useEffect,useRef } from 'react'
import axios from 'axios';
import {useParams,useNavigate} from 'react-router-dom'
import "./css/ViewPosts.css"
import { BiHeart,BiSolidShare,BiSolidHeart,BiChevronLeft,BiChevronRight } from "react-icons/bi";
import { IoSend } from "react-icons/io5";

const ViewPosts = () => {
  const params = useParams()
  const [liked,setLiked]= useState(false)
  const [data,setData] = useState({Like:[],Images:[{"0":{url:''}}]})
  const [followState, setFollowState] = useState(true)
  const [currentImage,setCurrentImage]=useState(0)
  const [likeData,setLikeData]=useState(0)
  const [comment,setComment]=useState('')
  const [commentArray,setCommentArray] = useState([])
  const [loading,setLoading]=useState(true)

  const InputComent = useRef(null)
  useEffect(()=>{
    
    axios.get("http://localhost:4000/post/"+params.id)
    .then(res=>{
      if(res.data.Status==='Error'){
        navigate('Home')
      }else{
        console.log(res.data);
        axios.get('http://localhost:4000/')
        .then(resu=>{
          if(res.data.Status === "Success"){
            const a = res.data.postData.Like.some((elm)=>elm===resu.data.dataUser.Pseudo)
            setLiked(a)
          }else{
            setLiked(false)
          }
        })
        setData(res.data.postData)
        setLikeData(res.data.likeData)
    }
    setLoading(false)
    },[])

    axios.get('http://localhost:4000/')
      .then(res=>{
        if(res.data.Status === "Success"){
          axios.post('http://localhost:4000/followVerif',{userID:res.data.dataUser._id,accountFollow:data.UserID})
          .then(ress=>{
            if(ress.data){
              setFollowState(true)
            }else{
              setFollowState(false)
            }
            console.log(ress);
          })
    
        }else{
          setFollowState(false)
        }},[])
        axios.post('http://localhost:4000/comment/search',{postID:params.id})
        .then(results=>{
          setCommentArray(results.data)
          console.log(results.data);
        })
  },[])

  useEffect(()=>{
    axios.get('http://localhost:4000/')
      .then(res=>{
        if(res.data.Status === "Success"){
          axios.post('http://localhost:4000/followVerif',{userID:res.data.dataUser.Pseudo,accountFollow:data.UserID})
          .then(ress=>{
            if(ress.data){
              setFollowState(true)
            }else{
              setFollowState(false)
            }})}

  })})

  const [width,setWidth] = useState('100%')
  const [height,setHeight] = useState('100%')

  useEffect(()=>{
    const w = data.Images[String(currentImage)].width
    const h = data.Images[String(currentImage)].height

    if(h===w){
      console.log((w/h)*70)
      setWidth("40vw")
    }else{
      setWidth("100%")
    }

    console.log(w,h);
  },[currentImage])

  const nextImage=()=>{
    if(currentImage<data.Images.length-1){
    setCurrentImage(currentImage+1)
    }else{
      setCurrentImage(0)
    }
    console.log(data.Images.length);
      
    
  }

  const handleLike=()=>{
    axios.get('http://localhost:4000/')
    .then(res=>{
    if(res.data.Status === "Success"){
      if(liked){
      
        axios.post('http://localhost:4000/post/'+params.id+'/rLike',{idUser:res.data.dataUser.Pseudo})
        // .then(res=>console.log(res))
        setLiked(false)
        setLikeData(likeData-1);
      }else{
  
        axios.post('http://localhost:4000/post/'+params.id+'/addLike',{idUser:res.data.dataUser.Pseudo})
        // .then(res=>console.log(res))
        setLiked(true)
        setLikeData(likeData+1);
    }
    }else{
      navigate('/login')
    }})
  }
  const follow = async()=>{
    await axios.get('http://localhost:4000/')
    .then(res=>{
      if(res.data.Status === "Success"){
        axios.post('http://localhost:4000/follow',{userID:res.data.dataUser.Pseudo,accountFollow:data.UserID})
        .then(ress=>{
          if(ress.data==='follow'){
            setFollowState(true)
          }else{
            setFollowState(false)
          }
        })
      }else{
        navigate("/login")
      }
    })
  }

  const handleComment=()=>{
    axios.get('http://localhost:4000/')
    .then(res=>{
      if(res.data.Status === "Success"){
        axios.post('http://localhost:4000/comment',{id:res.data.dataUser.Pseudo,message:comment,postID:data._id,})
        .then(res=>console.log(res.data))
        axios.post('http://localhost:4000/comment/search',{postID:params.id})
        .then(results=>{
          setCommentArray(results.data)
          InputComent.current.value=''
        })
      }})
    
      
  }

  const navigate = useNavigate()


  return (
    <>
    <div className='ViewArtWork'>
      <p className='title'>ArtWork Name</p>
      <div className="accountInfo">
        <div className="imgaccount"></div>
        <p onClick={(e)=> navigate("/account/"+data.UserID)} className="createBy">@{data.UserID}</p>
        { loading?
          <></>
          : 
          followState?
          <button onClick={follow} className='true'>suivie</button>
          :
          <button onClick={follow} className='false'>suivre</button>
        }
      </div>
      <button onClick={(e)=>console.log(data)}>H</button>
      <section className="imgSaction">
        <BiChevronLeft className='chevron' />
        <BiChevronRight className='chevron2' onClick={nextImage}/>
        <img className='noActive'  alt="" style={{width:width,height:height}} src={data.Images?data.Images[String(currentImage)].url:''}></img>
        <p className="imgCount">{currentImage+1}/{data.Images.length}</p>
            
      </section>
      <div className="PostCommand">
          <div className="likeBox">
            <button className='ii' onClick={()=>handleLike()}>
              {
                liked?
                <BiSolidHeart className='liked'/>
                :
                <BiHeart className='like'/>
              }
              
            </button>
            <p className="counter">{likeData}</p>
          </div>
          <BiSolidShare className='like'/>
          
        </div>
      <section className="descPart">
        <p className="sectionTitle">Description</p>
        <p className='descTxt'>{data.Desc}</p>
      </section>
      <section className='commentPart'>
              {
                commentArray.map((elm,index)=>(
                  <div className="commentWid">
                    <div className="commentprof" style={{cursor:'pointer'}} onClick={()=>navigate('/account/'+elm['UserID'])}></div>
                    <div className="commentHead">
                      <p className="createBy" style={{cursor:'pointer'}} onClick={()=>navigate('/account/'+elm['UserID'])}>@{elm['UserID']}</p>
                      <p className="commentContent">{elm['Content']}</p>
                    </div>
                  </div>
                ))
              }
              
      </section>
      <div  className='messageSender'>
      <input style={{width:'100%'}} ref={InputComent} onChange={(e)=> setComment(e.target.value)} placeholder={'Ecrivez un commentaire'} type="text" className='inputWidget'/>
      <button className='sandButton'  onClick={(e)=>handleComment()} ><IoSend fontSize={16} color='#242424'/></button>
      </div>
      
      
    </div>
    </>
  )
}

export default ViewPosts