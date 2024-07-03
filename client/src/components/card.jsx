import React from 'react'

const Card = (props) => {
  return (
    <a href={"http://localhost:3000/post/"+props.elm._id} key={props.index} className='cont'>
        <img  style={{backgroundImage: `url(${props.elm.Images[0].url})` }} alt="" className='thumbaile'/>
        <div className="hoverInfo">
        <p className="ArtTitle">{props.elm.Titre}</p>
        <p className="date">{props.elm.Images[0].created_at}</p>
        </div>
    </a>
  )
}

export default Card