import React from 'react'
import './css/Input.css'

const Input = (props) => {
  // const r=(e)=>{
  //   if(e.key==='Enter'){
  //     handleSendComment()
  //   }
  // }

  // const handleSendComment=()=>{
    
  // }

  return (
    <input style={{width:props.w}} placeholder={props.placeholder} type="text" className='inputWidget'/>
  )
}

export default Input