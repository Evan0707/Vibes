import React, { useState } from 'react'
import "./css/Button.css"
// import { useParams } from 'react-router-dom'

const Button = (props) => {
    return (
        <>
        {
            props.loading?
            <button type="button" onClick={props.e} className='ButtonLoading'><div className="loadingAnim"></div></button>
        :
            <button type="submit" onClick={props.e} className='Button'>{props.text}</button>
        }
        </>
            
    )
}

export default Button