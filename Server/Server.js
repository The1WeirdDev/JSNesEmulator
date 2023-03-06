const express = require("express");
const fs = require("fs");

const server = express();
const port = process.env.PORT || 8080;

server.listen(port, (error, data) => {
    if(error){
        console.log(`Error listening on port ${port}`);
    }else{
        console.log(`Successfully listening on port ${port}`);
    }
});

server.get("*", (req, res) =>{
    var url = req.url;
    if(url == "" || url == "/")
        url = "Client/Index.html";

    if(url.startsWith("/"))
        url = url.substring(1);
    
    SendUserFileData(url, res);
});

function SendUserFileData(url, res){
    try{
        const content_type = {"Content-Type": "text/html"};
        fs.readFile(url, (error, data) =>{
            if(error){
                res.writeHead(404, content_type);
                res.write("<html><h1>404 not found</h1></html>");
            }
            else{
                res.writeHead(200, content_type);
                res.write(data);
            }

            res.end();
        });
    }catch(exception){
        //TODO : Handle Exception
    }
}