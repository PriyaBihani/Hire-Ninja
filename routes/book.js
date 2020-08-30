const express = require('express')
const router = express.Router()
const Ninja = require('../models/ninja')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

router.get('/',(req,res)=>{
    res.render("bookNinja/book.ejs",{ninjas : null})
})



router.get('/ninjaList',async(req,res,next)=>{
    
    try {
        if(req.query.lat!=null && req.query.lon!= null ){
            console.log("request recieved ninjaList")
            let data= await ninjaList(req.query.lat,req.query.lon)
            res.json(data)
        }
    } catch(error)  {
        console.log(error)
    }
        
})
router.get('/details/:id',async(req,res)=>{
    console.log("request recieved")
    console.log(req.params.id)

})
async function ninjaList(lat,lon){
    const ninjaList= await Ninja.aggregate([{
        $geoNear:{
            near:{
                type:"Point",
                coordinates:[parseFloat(lat),parseFloat(lon)]
            },
        distanceField:"dist.calculated",
        maxDistance: 10000000,
        spherical:true 
        }
    }])
    return ninjaList
}
module.exports= router