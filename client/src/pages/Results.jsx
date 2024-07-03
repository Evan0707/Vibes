import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Results = () => {
    const params = useParams()
    const [posts,setPosts] = useState([])
    
    useEffect(()=>{
        axios.get('http://localhost:4000/results/'+params.query+'?filter=0')
        .then(res=> setPosts(res.data))
    },[])

  return (
    <div className="gallery">
        {posts.map((elm,index)=>(
          <a href={"http://localhost:3000/post/"+elm._id} key={index} className='cont'>
              <img  style={{backgroundImage: `url(${elm.Images[0].url})` }} alt="" className='thumbaile'/>
              <div className="hoverInfo">
                <p className="ArtTitle">{elm.Titre}</p>
                <p className="date">{elm.Images[0].created_at}</p>
              </div>
            </a>
        ))}
      </div>
  )
}

export default Results