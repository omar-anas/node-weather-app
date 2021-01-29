const path = require('path');
const geocode=require('./utils/geocode');
const forecast=require('./utils/forecast');
const express = require('express');
const hbs=require('hbs');

const app = express();

//creating paths
const publicdir = path.join(__dirname,'../public');
const partials = path.join(__dirname,'../templates/partials');
const viewpath = path.join(__dirname,'../templates/views');
//setup handelpars and view locations
app.set('view engine','hbs');
app.set('views',viewpath);
hbs.registerPartials(partials);


app.use(express.static(publicdir));

app.get('',(req,res)=>{
    res.render('index');
});


app.get('/help',(req,res)=>{
    res.render('help',{
        title:'HELP',
        name:'omar'
    })
});

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({error:'you must provide an address!'});
    }
    
    geocode(req.query.address,(error,{latitude,longitude,location}={})=>{
        if(error){
           return res.send({error});
        }
        

            forecast(latitude,longitude,(error,foredata)=>{
                if(error){
                    return res.send({error});

                }
                else{
                    res.send({
                        currentTemp:foredata.temp,
                        desc:foredata.main,
                        address:location,
                        icon:foredata.icon,
                        temp3:foredata.temp3,
                        temp6:foredata.temp6,
                        temp9:foredata.temp9,
                        temp12:foredata.temp12
                    })
                }
           })
        
    })

});


app.get('*',(req,res)=>{
    res.render('page404')
});

app.listen(3000,()=>{
    console.log('this server is working right now');
});