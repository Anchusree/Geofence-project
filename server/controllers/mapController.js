const db = require('../db');

module.exports.addName = (req,res)=>{
    const name = req.body.name
    const checkName = "select * from store where name=?"
    db.query(checkName,name,(err,response)=>{
        if(response.length>0){
            res.status(422).json({msg:'This place is already added in the list!'})
        }
        else{
            db.query("INSERT INTO store(name) VALUES(?)",name,(err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result){
                    res.status(200).json({msg:'Added place successfully'})
                }
                else{
                    res.status(400).json({msg:'Something went wrong'})
                }
            })
        }
    })

}

module.exports.mapInfo = (req,res)=>{

    const name = req.body.name
    const sql = "select * from store where name=?"


    db.query(sql,name,(err,result)=>{
        console.log("result",result)
        if(result){
            console.log(result)
            res.status(200).json(result)
        }
        else{
            console.log(err)
            res.status(400).json({msg:'Something went wrong'})
        }
    })
}

module.exports.addMap = (req,res)=>{
    const parentId = req.body.parentId
    const coordinates = req.body.coordinates

    const sqlQuery = "INSERT INTO store2 (id,parentId,coordinates) VALUES (id,?,?)"

    db.query(sqlQuery,[parentId,coordinates],(err,result)=>{
       
        if(result){
            res.status(200).json({msg:'Polygon added successfully'})
        }
        if(err){
            res.status(400).json({msg:'Something went wrong'})
        }
    })
}
