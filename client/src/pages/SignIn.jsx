import React from 'react'
import { useState } from 'react'
import axios from'axios'
import './css/SignIn.css'
import logo from '../img/ico.png'
import { BiSolidInfoCircle } from "react-icons/bi";


const SignIn = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [pseudo,setPseudo] = useState('')
    const [pass,setPass] = useState('')
    const [pseudoUsed,setPseudoUsed]=useState(true)

    const handleSubmit =(e)=>{
        e.preventDefault();
        if(pseudoUsed===false && name !=='' && email !=='' && pass !==''){
            axios.post("http://localhost:4000/register",{name,pseudo,email,pass})
            .then(result => console.log(result))
            .catch(err => alert(err))
        }
        
    }

    const handleCheck=(e)=>{
        e.preventDefault()
        setPseudo(e.target.value)
        axios.post("http://localhost:4000/pseudocheck",{pseudo:e.target.value})
        .then(result => setPseudoUsed(result.data))
    }

    return( 
            <form onSubmit={handleSubmit} className='formLog_Sign'>
                <img className='RegisterLogo' src={logo} alt="" />
                <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)}/>
                <div className="pseudoSec">
                    <input type="text" placeholder='pseudo' className='pseudoInput' onChange={(e)=>handleCheck(e)}/>
                    {
                        pseudoUsed?
                        <p className="useInfo" style={{color:'#ff3b3b'}}><BiSolidInfoCircle className='infoIcon' style={{color:'#ff3b3b'}}/>Pseudo early used</p>
                        
                        :
                        null
                    }
                </div>
                <input type="text" placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder='password' onChange={(e) => setPass(e.target.value)}/>
                <button type="submit" className='signButton'>SignIn</button>
            </form>
    )
}

export default SignIn