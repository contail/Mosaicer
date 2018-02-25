var express = require('express');
var fs = require('fs')
var router = express.Router();
var path = require('path')
/* GET  listing. */
router.get('/img', (req,res,next)=>{
  var folder_name = req.query.folder
  var file_name = req.query.file;
  var market= folder_name.split('/')
  var p=''
  if(market[0]=="market"){
    p=path.join('../','cloud','image',market[1])
  }
  else if(folder_name=='feedback')
  p=path.join('../',folder_name)
  else
  p = path.join('../', 'image', folder_name)

  var filename = path.join(p, file_name+".jpg")
  if(file_name=='empty'){
      filename="empty.jpg"
  }
  console.log('folder '+folder_name + 'file :' +file_name)
  if(!fs.existsSync(filename)){
  res.sendStatus(404)
  return
  }
  try {
    fs.readFile(filename, (err,data)=> {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(data)
    })
  } catch (err) {
    console.log(err)
  }
});


module.exports = router;
