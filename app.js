const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const { Console } = require("console");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


const url="https://codeforces.com/api/user.rating?";

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    let userId=req.body.userId;
    https.get(url+"handle="+userId,response=>{
        var data="";
        response.on("data",chunk=>{
            data+=chunk;
        });
        response.on("end",()=>{
            if(JSON.parse(data).status === "OK"){
                var contests=JSON.parse(data).result;
                var ans=`<table style="border: 1px solid black; border-collapse: collapse;"> <tr style="border: 1px solid black; border-collapse: collapse;"><th style="border: 1px solid black; border-collapse: collapse;">Contest Name</th><th style="border: 1px solid black; border-collapse: collapse;">Old Rating</th><th style="border: 1px solid black; border-collapse: collapse;">New Rating</th><th style="border: 1px solid black; border-collapse: collapse;">Rating Change</th><th style="border: 1px solid black; border-collapse: collapse;">Performance</th></tr>`;
                
                for(var i=contests.length-1;i>=0;i--){
                    var ratingChange=parseInt(contests[i].newRating)-parseInt(contests[i].oldRating);
                    var perf=contests[i].oldRating+4*ratingChange;
                    ans+=`<tr>
                    
                    <td>${contests[i].contestName}</td>
                    <td>${contests[i].oldRating}</td>
                    <td>${contests[i].newRating}</td>
                    <td>${ratingChange}</td>
                    <td>${perf}</td>
                    </tr>`
                }
                ans+=`</table>`;
            }else{
                ans=`Invalid handle ╰（‵□′）╯`;
            }
            
          //  console.log(orgData);
            res.send(ans);
        });
    }).on("error",err=>{
        console.log("error");
    });
});







app.listen(process.env.PORT || 3000, function(){
    console.log("Server is up..!!");
});