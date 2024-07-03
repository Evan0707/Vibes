import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import '../components/css/popup.css'

const Popup = ({text,visibility}) => {

  return (
        <div className='PopUp' style={{display:visibility}}>
            <div className="bgIconErrPop">
                <IoClose className='ErrorPopUpIcon'/>
            </div>
            <p className="MessagePopUp">{text}</p>
            <IoClose className='ClosePopUp'/>
        </div>
  )
}

export default Popup