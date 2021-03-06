var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
/* GET  listing. */
router.get('/img', (req,res)=>{
  'use strict';
  var folderName = req.query.folder;
  var fileName = req.query.file;
  var market= folderName.split('/');
  var p='';
  if(market[0]==='market'){
    p=path.join('../','cloud','image',market[1]);
  }
  else if(folderName==='feedback')
  p=path.join('../',folderName);
  else
  p = path.join('../', 'image', folderName);

  var filePath = path.join(p, fileName+'.jpg');
  if(fileName==='empty'){
      filePath='empty.jpg';
  }
  console.log('folder '+folderName + 'file :' +fileName);
  if(!fs.existsSync(filePath)){
  res.sendStatus(404);
  return;
  }
  try {
    fs.readFile(filePath, (err,data)=> {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(data);
    });
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
