import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './css/Home.css'
import Card from '../components/card'

const Home = () => {
  const [auth,setAuth] = useState(false)
  const [name,setName] = useState()
  const [postArray,setPostArray]=useState([])
  axios.defaults.withCredentials=true

  useEffect(()=>{
    axios.post('http://localhost:4000/post/randomPost')
        .then(result=>{
          setPostArray(result.data)
          console.log(result.data);
        })

    axios.get('http://localhost:4000/')
    .then(res=>{
      if(res.data.Status === "Success"){
        setAuth(true)
        setName(res.data.dataUser.Name)
        console.log(res)
        
      }else{
        setAuth(false)
      }
    })
    
  },[])

  const recipe=()=>{
    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772')
    .then(res=>console.log(res.json()))
  }

  return (
    <div>
      {
        auth?
        <div>
          <p>Vous êtes connecté {name}</p>
          <button>Logout</button>
        </div>
        :
        <div>
          <p>Vous n'êtes pas connecté</p>
          <button>Login</button>
        </div>
      }
      <div className="gallery">
        {postArray.map((elm,index)=>(
          <Card elm={elm} index={index}></Card>
          // <a href={"http://localhost:3000/post/"+elm._id} key={index} className='cont'>
          //     <img  style={{backgroundImage: `url(${elm.Images[0].url})` }} alt="" className='thumbaile'/>
          //     <div className="hoverInfo">
          //       <p className="ArtTitle">{elm.Titre}</p>
          //       <p className="date">{elm.Images[0].created_at}</p>
          //     </div>
          //   </a>
        ))}
      </div>
      <button onClick={()=>recipe()}>Hello</button>
    </div>

  )
}

export default Home