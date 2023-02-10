import React from 'react'
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api'
import { useCallback } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { useState } from 'react';

function EditMap({apiKey,paths,point,center,setPoint,close,id,color,setColor}) {
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);

    const [editColor, setEditColor] = useState(color)
    let colorArray = ['Red', 'Green','Yellow','Blue','Pink','Orange'];

    const handleColorChange = event => {
      setEditColor(event.target.value);
  };
  

  
    var new_path =  JSON.stringify(point);
    // Call setPath with new edited path
    const onEdit = useCallback(() => {
      if (polygonRef.current) {
        const nextPath = polygonRef.current
          .getPath()
          .getArray()
          .map(latLng => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
        setPoint(nextPath);
        setEditColor(editColor)
        setColor(editColor)
       
      }
    },[setPoint,color]);
  
    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
      polygon => {
          setPoint(paths)
        polygonRef.current = polygon;
        const path = polygon.getPath();
        listenersRef.current.push(
          path.addListener("set_at", onEdit),
          path.addListener("insert_at", onEdit),
          path.addListener("remove_at", onEdit)
        );
      },
      [onEdit,paths,setPoint]
    );
      // Clean up refs
      const onUnmount = useCallback(() => {
        listenersRef.current.forEach(lis => lis.remove());
        polygonRef.current = null;
      }, []);

      // console.log('editColor',editColor)

      const refreshPage=()=>{ 
        window.location.reload()
    }

    const updateMap= async ()=>{
        await axios.post('http://localhost:2000/api/updateGeoMap',{parentId:id,coordinates:new_path,color:editColor})
        .then(response=>{
            if(response){
                console.log(response.data)
                alert("Map Updated successfully")
                refreshPage()
                
              }
            }
        )
        .catch(err=>{
          console.log(err)
        })
      }
     
    return (
        <div className="App">
         
        <LoadScript
          id="script-loader"
          googleMapsApiKey={apiKey}
          language="en"
          region="us"
        >
          {
            paths.length >1 
            ?
          <GoogleMap
            mapContainerClassName="appmap"
            center={center}
            zoom={12}    
          >
            <Polygon
              path={point}
              editable
              onMouseUp={onEdit}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                fillColor: editColor ? editColor : color,
                strokeColor: `#0a6ebd`,
                fillOpacity: 0.5,
                strokeWeight: 2
              }}
            />
          </GoogleMap>
           :
           <h2>No Geofence added</h2>
          }
        </LoadScript> 
         <br/>
         <select value={editColor} onChange={handleColorChange}>
        <option>Select</option>
        {
          colorArray.map((item,index)=>
          <option key={index}>{item}</option>
          )
        }
      </select>
      <br/>
         <button onClick={updateMap}>Update</button>
         <button onClick={close}>Close</button>
         
      </div>
    )
}

export default EditMap