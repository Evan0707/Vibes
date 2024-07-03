import React from 'react'
import { useState } from 'react'
import axios from'axios'
import { useNavigate } from 'react-router-dom';
import logo from '../img/ico.png'
import Popup from '../components/popup';
import Button from '../components/Button';


const Login = () => {

    const [email,setEmail] = useState()
    const [pass,setPass] = useState()
    const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState()
    const [showMessage,setShowMessage] = useState(false)
    axios.defaults.withCredentials=true
    const handleSubmit =async(e)=>{
        setLoading(true)
        e.preventDefault();
        await axios.post("https://vibes-drab.vercel.app/login",{email,pass})
        .then(result => {console.log(result)
            if(result.data === "No Account"){
                setMessage(result.data)
                setShowMessage(true)
                setTimeout(function(){setShowMessage(false)},5000)
            }else{
                navigate("/")
            }
        })
        .catch(err => {console.log(err)
            
        })
        setLoading(false)
    }

    const navigate = useNavigate()

    return(
        <>  
        {
            showMessage?
                <Popup text={message} visibility={'flex'}/>
            :
                <Popup text={'no message'} visibility={'none'}/>
        }
            
            <form  className='formLog_Sign'>
                <img className='RegisterLogo' src={logo} alt="" />
                <input type="text" placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder='password' onChange={(e) => setPass(e.target.value)}/>
                {
                    loading?
                    <Button loading={true} e={handleSubmit} text='LogIn'/>
                    :
                    <Button loading={false} e={handleSubmit} text='LogIn'/>

                }
            </form>
        </>
    )
}

export default Login