import React, { useState,useEffect } from 'react'
import "./css/Header.css"
import {BiUpload,BiSearch,BiChevronDown,BiSolidBell,BiLogOut, BiFilter,BiLogoInstagramAlt} from 'react-icons/bi'
import { IoClose } from "react-icons/io5";
import axios from 'axios'
import logo from '../img/Log_UniCol.png'
import { useNavigate } from 'react-router-dom'



const Header = () => {
  const [showAccountPopUp,setShowAccountPopUp] = useState(false)
  const [auth,setAuth] = useState(false)
  const [name,setName] = useState('')
  const [namePara,setNamePara] = useState('')
  const [Bio,setBio] = useState("")
  const [BioPara,setBioPara] = useState("")
  const [userId,setUserId] = useState()
  const [searchBarVal,setSearchBarVal] = useState()
  const [showParam,setShowParam] = useState(false)
  const [pic,setPic]=useState()


  axios.defaults.withCredentials=true
  useEffect(()=>{
    axios.get('http://localhost:4000/')
    .then(res=>{
      if(res.data.Status === "Success"){
        setAuth(true)
        setUserId(res.data.dataUser.Pseudo)
        setName(res.data.dataUser.Name)
        setNamePara(res.data.dataUser.Name)
        setBio(res.data.dataUser.Bio)
        setBioPara(res.data.dataUser.Bio)
        setPic(res.data.dataUser.PicUrl)
      }else{
        setAuth(false)
      }
    })
  },[])

  // useEffect(()=>{
  //   axios.get('http://localhost:4000/')
  //   .then(res=>{
  //     if(res.data.Status === "Success"){
  //       setUserId(res.data.dataUser._id)
  //       setName(res.data.dataUser.Name)
  //       setBio(res.data.dataUser.Bio)
  //       setBioPara(res.data.dataUser.Bio)
  //       setNamePara(res.data.dataUser.Name)
  //     }
  //   })
  // },[])


  function UpdateAccount(){
    console.log(BioPara);
    axios.post('http://localhost:4000/account/update',{name:namePara,bio:BioPara,id:userId})
    .then(res=>{
      
    })
    setShowParam(false)
    
    
  }

  const handlePopUp =()=>{
    if (showAccountPopUp === true){
      setShowAccountPopUp(false)
    }else{
      setShowAccountPopUp(true)
    }
  }

  const navigate  = useNavigate()

  const printt =()=>{
    navigate('/results/'+searchBarVal)
    // console.log("search: "+searchBarVal)
  }

  // const handleBio=(e)=>{
  //   setBioPara(e.target.value)
  // }


  return (
    <div className='PB'>
      <div className="left">
        <img src={logo} alt="" />
        <div className="InputBox">
          <input type="text" placeholder='Search artworks...' onChange={(e)=> setSearchBarVal(e.target.value)}/>
          <BiFilter className='ss' onClick={(e)=>console.log(Bio)}/>
          <BiSearch className='ss' onClick={printt}/>
        </div>
      </div>
      <div className="right">
        <BiUpload className='ee' onClick={(e)=> navigate('/post/create')}/>
        <BiSolidBell className='ee'/>
        <div className="AccountSection">
          {
            showAccountPopUp?
            <div className="AccountPopUp">
              <h6>{name}</h6>
              <button className='buttonPopUp' onClick={(e)=>navigate('/account/'+userId)}>My Account</button>
              <button className='buttonPopUp' onClick={()=>navigate('/account/'+userId+'/preferences')}>Paramètre</button>
              <button className='buttonPopUp'>Log Out<BiLogOut/></button>
            </div>
            :
            <div className="AccountPopUpFalse">
              <h6>Account Name</h6>
              <button className='buttonPopUp'>My Account</button>
              <button className='buttonPopUp'>Paramètre</button>
              <button className='buttonPopUp'>Log Out<BiLogOut/></button>
            </div>
          }
          {
            auth?
            <div className='profBox'>
              <div className="profimg" style={{backgroundImage: `url('${pic}')`,backgroundSize:'cover'}}></div>
              <button className='MoreAccount' onClick={handlePopUp}><BiChevronDown className='cc'/></button>
            </div>
            :
            <a href='http://localhost:3000/login' className='logButton'>Login</a>
          }
        </div>
      </div>
    </div>
  )
}

export default Header