
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import EditMap from './EditMap'
import ViewMap from './ViewMap'
import {useHistory} from 'react-router-dom'


class Point{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}

export default function Map1({ id, name,index, map }) {

  const history = useHistory()

  const [modalView, setModalView] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  

  const openViewModal = () => {
    setModalView(true)
  }
  const openEditModal =()=>{
    setModalEdit(true)
  }
  const closeModal =()=>{
    setModalEdit(false)
  }
  const [coordinates, setCoordinates] = useState()

  const [color,setColor] = useState()

  const [allMaps, setAllMaps] = useState([])

  const getAllCoordinateMaps = ()=>{
    axios.get('http://localhost:2000/api/getAllCoordinateMaps')
      .then(response => {
        if (response) {
          setAllMaps(response.data)
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    let unmounted = false
    setTimeout(() => {
      if (!unmounted) return getAllCoordinateMaps()
    }, 50);
    return () => { unmounted = true }
  }, [])


  useEffect(() => {
    let unmounted = false;
    setTimeout(() => {
      if (!unmounted) {
        axios.post('http://localhost:2000/api/allGeoMapInfo', { parentId: map.id })
          .then(response => {
            if (response.data.result.length > 0 && response.data.result[0].coordinates) {
              setCoordinates(JSON.parse(response.data.result[0].coordinates + '}]'));
              setColor(response.data.result[0].color)
            }
          }
          )
      }
    }, 51)
    return () => { unmounted = true; }
  }, [map.id])

  let points = []

  if (coordinates !== undefined) {
    for (let i = 0; i < coordinates.length; i++) {
      points.push(coordinates[i])
    }
  }

  const [state, setState] = useState(points)

  const deleteMap = (id)=>{
    if(window.confirm("Are you sure you want to delete?")){

      axios.delete(`http://localhost:2000/api/deleteMap/${id}`)
      .then(response=>{
        alert("Successfully deleted coords")
        getAllCoordinateMaps()
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else{
      console.log("Cancelled");
    }
  }

  let checkMap;
  var newArray = allMaps.map((item)=>{
    if(item.parentId === map.id){
      checkMap = map.id
    }
  })

  const addMap = (name)=>{
    history.push(`/map/${name}`)
  }

  const deleteMapName = (id)=>{
    if(window.confirm("Are you sure you want to delete?")){

      axios.delete(`http://localhost:2000/api/deleteMapName/${id}`)
      .then(response=>{
        alert("Successfully deleted map")
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else{
      console.log("Cancelled");
    }
  }

  
let INF = 10000;
  const checkGeofence = (map)=>{

    let coordinates = points.map(element=>{
      return new Point(element.lat,element.lng)
    })
    let n = coordinates.length
    let p = new Point(map.latitude,map.longitude)

    if(isInside(coordinates,n,p)){
      alert("Geofence is inside the location")
    }
    else{
      alert("Geofence is outside the location")
    }
  }

  const isInside = (polygon,n,p)=>{

    if(n < 3){//there is atleast 3 vertices in polygon
      return false
    }

    //create a point for line segment from p to infinite
    let extreme = new Point(INF,p.y)

    let count = 0, i =0 //count intersections

    do{
      let next = (i+1) % n
      //Check if line segment from p to extreme intersects from polygon[i] to polygon[next]
      if(doIntersect(polygon[i],polygon[next],p,extreme)){
        //if point p is colinear with line segment  i-next 
        if(orientation(polygon[i],p,polygon[next]) === 0){
          return onSegment(polygon[i],p,polygon[next])
        }
        count++;
      }
      i=next
    }
    while(i !==0)
    return (count % 2 === 1)
  }

  const doIntersect =(p1,q1,p2,q2)=>{
    let o1 = orientation(p1,q1,p2)//find four orientation needed for general and special case
    let o2= orientation(p1,q1,q2)
    let o3 = orientation(p2,q2,p1)
    let o4 = orientation(p2,q2,q1)

    if(o1 !== o2 && o3 !== o4){
      return true
    }

   // Special Cases
    // p1, q1 and p2 are collinear and
    // p2 lies on segment p1q1
    if (o1 === 0 && onSegment(p1, p2, q1)) {
      return true;
    }
  
    // p1, q1 and p2 are collinear and
    // q2 lies on segment p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) {
      return true;
    }
  
    // p2, q2 and p1 are collinear and
    // p1 lies on segment p2q2
    if (o3 === 0 && onSegment(p2, p1, q2)) {
      return true;
    }
    // p2, q2 and q1 are collinear and
    // q1 lies on segment p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) {
      return true;
    }

    return false

  }
  const orientation=(p,q,r)=>{
    let val = (q.y-p.y) * (r.x - q.x)-(q.x - p.x) * (r.y -q.y)
    if(val === 0){
      return 0;
    }
    return (val > 0) ? 1 : 2;

  }
  const onSegment = (p,q,r)=>{

    if (q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)) {
      return true;
    }
    return false

  }

  return (
    <>
      <tr>
        <td>{index+1}</td>
        <td>{name}</td>
        <td>{map.latitude ? map.latitude : null}</td>
        <td>{map.longitude ? map.longitude : null}</td>
        <td>
          {
            checkMap && checkMap !== undefined
            ?
            <>
          <button className='btn btn-info text-white' onClick={openViewModal}>View</button>&nbsp;
          <button className='btn btn-secondary text-white' onClick={openEditModal}>Edit</button>&nbsp;
          <button className='btn btn-warning text-white' onClick={()=>deleteMap(map.id)}>Remove</button>&nbsp;
          <button className='btn btn-success text-white' onClick={()=>checkGeofence(map)}>Check Geofence</button>
          </>
          :
          <>
          <button className='btn btn-primary text-white' onClick={()=>addMap(map.name)} >Add New</button>&nbsp;
          <button className='btn btn-danger text-white' onClick={()=>deleteMapName(map.id)} >Delete</button>
          </>
          }
          
        </td>
      </tr>
      <Modal
        isOpen={modalView}
        ariaHideApp={false}
        contentLabel="View Map"
      >
      <ViewMap points={points} setModalView={setModalView} 
      color={color} latitude ={map.latitude} longitude={map.longitude}
      />
      </Modal>

      <Modal
        isOpen={modalEdit}
        ariaHideApp={false}
        contentLabel="Edit Map"
      >
      <EditMap 
        apiKey={process.env.REACT_APP_GOOGLEAPI}
        paths={points}
        point={state}
        center={points[0]}
        setPoint={setState}
        close={closeModal}
        id={id}
        color = {color}
        setColor = {setColor}
        
      />
      </Modal>
    </>

  )
}
