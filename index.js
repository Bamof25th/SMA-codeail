const express = require('express');
const app = express();
const port = 8000;



app.listen(port, function(err){
    if(err) {
        
        console.log(`Error in runnning the server : ${err}`);   
    }
         console.log(`srever is running on port ${port}`);
});
