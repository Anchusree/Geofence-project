import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import GeoMaps from './GeoMaps';

function AddGeoMap() {
    let btnRef = useRef();

    let {name} = useParams()
    const [mapLocation,setLocation] = useState();
    const history = useHistory();
    const [mapInfo,setMapInfo] = useState([])

    useEffect(async()=>{
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${process.env.REACT_APP_GOOGLEAPI}`)
        .then(resp=>resp.json())
        .then(data=>{
            console.log(data)
            //so to get the gemotry location:
            setLocation(data.results[0].geometry.location)    
        }
        )
        //get mapinfo:
        await axios.post("http://localhost:2000/api/getMapInfo",{name:name})
        .then((response)=>{
            //console.log("response",response)
            setMapInfo(response)
        })

        return()=>{
          setLocation(null)
          setMapInfo(null)
        }

    },[name])

    const center = mapLocation;
    const [state,setState] = useState([])
    const {paths} = state


    const new_path = JSON.stringify(state.paths)
    //console.log(new_path)


    const saveMap = async()=>{
      await axios.post("http://localhost:2000/api/addMap",{parentId:mapInfo.data[0].id,coordinates:new_path})
      .then(response=>{
        if(response){
          alert(`${response.data.msg}`)
        }
        else{
          alert("Something went wrong")
        }
      })
      .catch(err=>{
        console.log(err)
      })

      if(btnRef.current){
        btnRef.current.setAttribute("disabled","disabled")
      }
    }


  return (
    <div >
      <GeoMaps
        apiKey ={process.env.REACT_APP_GOOGLEAPI}
        center={center}
        paths = {paths}
        point={paths => setState({paths})}
      /> 
      <br/><br/><br/><br/>
      {
        paths && paths.length > 1
        ?
        <button ref={btnRef} onClick={saveMap}>Save Map</button>
        :
        null
      }
      <button onClick={()=>history.push("/")}>Go Back</button>


        

    </div>
  )
}

export default AddGeoMap