import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import Map1 from './Map1';

export default function Home() {

    const history = useHistory()
    const [name,setName] = useState('');
    const [allMaps, setAllMaps] = useState([])

    let message=''

    const [latitude,setLatitude] = useState('')
    const [longitude,setlongitude] = useState('')

    const addName=async()=>{

        var place =  await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${process.env.REACT_APP_GOOGLEAPI}`)
        .then(resp=>resp.json())
        .then(data=>{ return data})

        if(place && place.results.length > 0){

           await setLatitude(place.results[0].geometry.location.lat)
           await setlongitude(place.results[0].geometry.location.lng)

           if(latitude && longitude){
            await axios.post('http://localhost:2000/api/addName',{name:name, latitude:latitude,longitude:longitude})
            .then(response=>{
                if(response){
                    message = response.data.msg
                    history.push(`/map/${name}`)
                }
            })
            .catch(err=>console.log(err))
           }
           
           else{
            console.log("Something went wrong");
           }
         



         
        }
        else{
            alert("Entered place is not valid! Try again")
        }

       

    }

    const getAllMaps = ()=>{
        axios.get('http://localhost:2000/api/getAllMaps')
        .then(response=>{
            if(response){
               setAllMaps(response.data)
            }
        })
        .catch(err=>console.log(err))
    }

    useEffect(()=>{
        let unmounted = false;
        setTimeout(() => {
            getAllMaps()
            
        }, 1000);
        return ()=>{unmounted= true;setAllMaps([])}
    },[])

    //console.log(allMaps)


  return (
    <div>
        <div style={{marginTop:'10px'}}></div><br/>
        <input type="text" placeholder="Search..." onChange={(e)=>setName(e.target.value)} value={name} className="searchtext"/>&nbsp;
        <Button className="btn btn-primary searchbtn" style={{borderRadius:'5px'}} disabled={name === "" ? true : false} onClick={addName}>Add</Button>
        <br/>
        <h3>Map List</h3>
        <div>
            <Table striped bordered hover className='w-90'>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>PLACE</th>
                    <th>LATITUDE</th>
                    <th>LONGITUDE</th>
                    <th>ACTIONS</th>
                    </tr>
                    </thead>
                  
                <tbody>
                   
                        {
                            allMaps.map((map,index)=><Map1 key={map.id} id={map.id} name={map.name} index={index} map={map}/>)
                            
                               
                            
                        }
                  
                </tbody>
            </Table>
        </div>






    </div>
  )
}
