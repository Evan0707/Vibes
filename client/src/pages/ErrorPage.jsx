import React from 'react'
import img from '../img/404Error.png'

const ErrorPage = () => {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column'}}>
      <img src={img} alt="" style={{width:"40vw",height:"26vw"}}/>
      <p style={{fontSize:30,fontWeight:600}}>Page not found</p>
    </div>
  )
}

export default ErrorPage