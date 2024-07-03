import React, { useEffect, useState } from 'react'
import "./css/MyAccount.css"
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { IoCloseSharp } from "react-icons/io5";

const Accounts = () => {
  const [auth,setAuth] = useState(false)
  const [data,setData] = useState({Name:''})
  const [post,setPost] = useState([])
  const [follower,setFollower] = useState()
  const [following,setFollowing] = useState()
  const [myAccount,setMyAccount] = useState(false)
  const [followState,setFollowState]=useState(false)


  axios.defaults.withCredentials=true
  const params = useParams()

  
  useEffect(()=>{
    
    axios.get('http://localhost:4000/account/'+params.pseudo)
    .then(result=>{
      setData(result.data.accountInfo)
      setFollower(result.data.follower)
      setFollowing(result.data.following)
    })

    
  },[])

  useEffect(()=>{
    axios.get('http://localhost:4000/')
      .then(res=>{
        if(res.data.Status === "Success"){
          axios.post('http://localhost:4000/followVerif',{userID:res.data.dataUser.Pseudo,accountFollow:data.Pseudo})
          .then(ress=>{
            if(ress.data){
              setFollowState(true)
            }else{
              setFollowState(false)
            }})}

            if(res.data.dataUser.Pseudo===data.Pseudo){
              setMyAccount(true)
            }else{
              setMyAccount(false)
            }
    
            axios.post('http://localhost:4000/post/search',{id:data.Pseudo})
            .then(results=>{
              setPost(results.data)
            })
  })})

  const follow = ()=>{
    
    axios.get('http://localhost:4000/')
    .then(res=>{
      if(res.data.Status === "Success"){
        axios.post('http://localhost:4000/follow',{userID:res.data.dataUser.Pseudo,accountFollow:data.Pseudo})
        .then(ress=>{
          if(ress.data==='follow'){
            setFollowState(true)
            
          }else{
            setFollowState(false)
          }
        })
      }
    })
  }

  const handleRemovePost=(id)=>{
    axios.post('http://localhost:4000/post/delete',{postID:id})
    .then(ress => {console.log(ress.data)})
  }

  return (
    <>
      <div className="TopPart">
        <div className="ProfilImage"></div>
        <div className="infoUserArt">
          <div className="folowBox">
            <h3>{data.Name}</h3>
            <img src="" alt="" />
            {
              !myAccount?
                followState?
                <button onClick={follow} style={{backgroundColor:'#fff',color:'#000'}} className='true'>suivie</button>
                :
                <button onClick={follow} className='false'>suivre</button>
              :
              <></>
            }
          </div>
          <div className="ProfStats">
            <p className="follower">Abonnée {follower}</p>
            <p className="following">Abonnement {following}</p>
          </div>
        </div>  
      </div>
      <section className='Desc'>
          <div className="spec">
            <p className='specWid'>XXXXXXX</p>
            <p className='specWid'>XXXXXXX</p>
          </div>
          {
            data.Bio?
            <div className="bio">
               {data.Bio}
              <span>🏈@test_123</span>
            </div>
            :
            <div></div>
          }
          
      </section>

      <section className='Gallery'>

      {
      myAccount?
        post.map((elm,index)=>(
            <div style={{backgroundColor:'red'}}>
            <a href={"http://localhost:3000/post/"+elm._id} key={index} className='cont'>
                <img  style={{backgroundImage: `url(${elm.Images[0].url})` }} alt="" className='thumbaile'/>

                <div className="hoverInfo">
                  <p className="ArtTitle">{elm.Titre}</p>
                  <p className="date">{elm.Images[0].created_at}</p>
                </div>
              </a>
              <IoCloseSharp style={{position:'absolute',zIndex:9999}} color={'#ffff'} fontSize={18} onClick={()=>handleRemovePost(elm._id)}/>
              </div>
          
      ))
    :
    post.map((elm,index)=>(     
      <a href={"http://localhost:3000/post/"+elm._id} key={index} className='cont'>
          <img  style={{backgroundImage: `url(${elm.Images[0].url})` }} alt="" className='thumbaile'/>
          <div className="hoverInfo">
            <p className="ArtTitle">{elm.Titre}</p>
            <p className="date">{elm.Images[0].created_at}</p>
          </div>
        </a>
    ))}

      
      </section>
    </>
  )
}

export default Accounts