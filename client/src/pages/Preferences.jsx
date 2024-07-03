import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './css/Preferences.css'
import Button from '../components/Button'

const Preferences = () => {
    
    const params = useParams()
    const [lenghtBio,setLenghtBio]=useState(0)
    const [name,setName] = useState()
    const [bio,setBio] = useState()
    const[userID,setUserID]=useState()
    const [loading,setLoading]=useState(false)
    const [pic,setPic] = useState()
    const [image,setImage]=useState()

    const currentName = useRef(null)
    const currentBio = useRef(null)

    const navigate = useNavigate()

    useEffect(()=>{
        axios.get('http://localhost:4000/').then(res=>{
            if(res.data.Status=="Success"){
            axios.get('http://localhost:4000/account/preferences/'+params.pseudo)
            .then(result=>{
                console.log(result);
                setName(result.data.Name)
                setBio(result.data.Bio)
                setUserID(result.data.Pseudo)
                setPic(result.data.PicUrl)
            })
        }})

        
    
        
      },[])

      const mention=(e)=>{
        console.log(e);
        // const text = e.target.value
        // console.log(text[-1]);
        // const lastChar= text.substr(-1)
        // console.log(lastChar);
        // if (lastChar==="@"){
        //     console.log('mention stats');
        // }
      }
      const changeProfil=()=>{
        setLoading(true)
        axios.post('http://localhost:4000/account/update',{id:userID,bio:currentBio.current.value,name:currentName.current.value,pic:image})
        .then(res=>{
            navigate('/')
            setLoading(false)
        })
      }

      const open=()=>{
        PicSelect.current.click()
      }

      const PicSelect = useRef(null)


      const handleImage=(e)=>{
        const file = e.target.files[0]
        setFileToBase(file)
        const url = URL.createObjectURL(file)
        setPic(url)
        console.log(url);
      }
    
      const setFileToBase=(file)=>{
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend=()=>{
          setImage(reader.result)
        }
      }

  return (
    <section className='PreferencesSection' style={{position:'relative'}}>
        <div className="principalInfo">
            <div className='PicPreferences' onClick={()=>open()} style={{backgroundImage: `url('${pic}')`,backgroundSize:'cover'}} ><p className='PicTxt'>Change</p></div>
            <input ref={PicSelect} type="file" onChange={(e)=>handleImage(e)} hidden name="" id="" />
            <div className='principale-left'>
                <p>Nom d'utilisateur</p>
                {name?
                    <input ref={currentName} defaultValue={name} type="text" className='prefInput' placeholder='User name'/>
                    :
                    <input type="text" className='prefInput' placeholder='User name'/>
                }
                <p>Bio</p>
                {bio?
                    <textarea ref={currentBio} onChange={(e)=>setLenghtBio(e.target.value.length)} defaultValue={bio} name="" style={{height:80}} className='prefInput' id="" placeholder='Bio'></textarea>
                    
                    :
                    <textarea onChange={(e)=>setLenghtBio(e.target.value.length)} name="" style={{height:80}} className='prefInput' id="" placeholder='Bio'></textarea>
                }
                <p style={{textAlign:'right',fontSize:12,color:'#878787',fontWeight:600}}>{lenghtBio}/300</p>
                
                
                
            </div>
        </div>
        <div style={{display:'flex',justifyContent:'right',width:'61%'}}>
            <button className='cancelPref' style={{backgroundColor:'#878787',marginRight:10}}>Cancel</button>
            {
                loading?
                <button className='savePref' style={{color:"#0000",backgroundColor:'#626262'}} >Save</button>
                :
                <button className='savePref' onClick={()=>changeProfil()}>Save</button>
            }
        </div>
        <select name="cars" id="cars">
            <option value="volvo">3d modeling</option>
            <option value="saab">3d sculpting</option>  
            <option value="mercedes">3d animation</option>
            <option value="audi">Motion designer</option>
            <option value="audi">game designer</option>
        </select>
    </section>
  )
}

export default Preferences