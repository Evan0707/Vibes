import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import "./css/CreatePosts.css"
import { BiSolidTrashAlt,BiCloudUpload } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import { MdAdd } from "react-icons/md";
import logo from '../img/ico.png'
import { useNavigate } from 'react-router-dom';

import SoftIcon from '../components/Software/SoftIcone';



const CreatePosts = () => {
  const [title,setTitle] = useState()
  const [desc,setDesc] = useState()
  const [tag,setTag] = useState([])
  const [image,setImage]=useState([])
  const [tagVal,setTagVal] = useState()
  const [idUser,setIdUser] = useState()
  const [auth,setAuth] = useState(false)
  const inputRef = useRef(null)
  const [imageUrl,setImageUrl] = useState([])
  const [maxImage,setMaxImage] = useState(false)
  const [softPop,setSoftPop]=useState(false)
  const [softUsed,setSoftUsed]=useState([])
  const navigation = useNavigate()

  useEffect(()=>{
    axios.get('http://localhost:4000/')
    .then(res=>{
      if(res.data.Status === "Success"){
        setAuth(true)
        setIdUser(res.data.dataUser.Pseudo)
        console.log(res)
      }else{
        setAuth(false)
      }
    })
  },[])

  useEffect(()=>{
    if(imageUrl.length <3){
      setMaxImage(false)
    }else{
      setMaxImage(true)
    }
  },[imageUrl])

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log("click");
    if(auth){
      axios.post("http://localhost:4000/create",{title,desc,tag,idUser,image})
      .then(result => navigation('/'))  
    }else{
      alert('pas connecté')
    }
    
  }

  const addTag =()=>{
    if (tag.length <=4){
      setTag([...tag,tagVal])
      console.log(tag)
    }else{
      alert("Max Tag")
    }
  }

  const removeTag =(index)=>{
    const list = [...tag]
    list.splice(index,1)
    setTag(list)
  }

  const handleImage=(e)=>{
    const file = e.target.files[0]
    setFileToBase(file)
    const url = URL.createObjectURL(file)
    setImageUrl(prev=>[...prev,url])
    console.log(image)
  }

  const setFileToBase=(file)=>{
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend=()=>{
      setImage(prev=>[...prev,reader.result])
    }
  }

  const handleFile=()=>{
    inputRef.current.click()
    // setImageUrl(URL.createObjectURL(image))
  }

  const delImage=(index)=>{
    const list = [...imageUrl]
    list.splice(index,1)
    setImageUrl(list)

    const liste2=[...image]
    liste2.splice(index,1)
    setImage(liste2)
    console.log(image);
  }
  const checkCorr=(val,soft)=>{
    return val===soft
  }


  return (
    <>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className='InputSection'>
            <p className='InputTitle'>Title</p>
            <input type="text" placeholder='Donnez un titre' onChange={(e)=> setTitle(e.target.value)}/>
          </div>
          <div className="ImageInputSection">
            {
              maxImage?
              <></>
              :
              <div className="img1" onClick={handleFile}>
              <BiCloudUpload className='CloudIcon'/>
              <input type="file" name="" id="" onChange={handleImage} hidden ref={inputRef}/>
              <label htmlFor="">Choose Image</label>
            </div>
            }
      
            {
              imageUrl.map((elm,index)=>(
                <div className="img2"  style={{backgroundImage: `url(${elm})`}}><button><IoClose onClick={()=>delImage(index)} className='closeIcon'/></button></div>
              ))
            }
          </div>
          <div className='InputSection'>
            <p className='InputTitle'>Description</p>
            <textarea name="description" id="" placeholder='Donnez une description' onChange={(e)=> setDesc(e.target.value)}></textarea>
          </div>
          <div className='InputSection'>
            <p className='InputTitle'>Tags</p>
            <div className='addTagsInput'>
              <input type="text" placeholder='Tags' name='taggg' onChange={(e)=> setTagVal(e.target.value)}/>
              <p>{tag.length}/4</p>
              <button type='button' onClick={addTag}><MdAdd /></button>
            </div>
            <div className='taags'>
              {tag.map((elm,index)=>(
                <div key={index} className='TagWid'>
                  <p>{elm}</p>
                  <button type='button' onClick={()=>removeTag(index)}><BiSolidTrashAlt className='trash'/></button>
                </div>
              ))}
            </div>
          </div>
          <div className="softFrame">
            {
              softUsed.map((val,i)=>(
                <SoftIcon soft={val}/>
              ))
            }
              <div className="addSoftBox">
                <MdAdd  fontSize={40} style={{backgroundColor:'#262626',borderRadius:'10px'}} onClick={()=> {if(softPop){setSoftPop(false)}else{setSoftPop(true)}}}/>
                  {
                    softPop?
                    <div className="softSelect">
                      <input type="text" />
                      <div className="gridSoft">
                      <SoftIcon soft={'nuke'} onclick={()=>{setSoftUsed(prev=>[...prev,'nuke'])}}/>
                      <SoftIcon soft={'designer'} onclick={()=>{setSoftUsed(prev=>[...prev,'designer'])}}/>
                      <SoftIcon soft={'painter'} onclick={()=>{setSoftUsed(prev=>[...prev,'painter'])}}/>
                    </div>
                    </div>
                    :
                    <></>
                  }
                
                
              </div>
          </div>
          

          <div className="acceptComment">
            <p>Autoriser les commentaires<input type="checkbox" style={{accentColor:'#8F00FF'}}/></p>
          </div>


          <button className='uploadButtonDel' type="submit">Delete</button>
          <button className='uploadButton' type="submit">Upload</button>
        </form>
      </div>
    </>
  )
}

export default CreatePosts