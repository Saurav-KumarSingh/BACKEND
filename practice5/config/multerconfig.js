const multer=require('multer');
const path=require('path');
const crypto=require('crypto');

//diskStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/upload')
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12,(err,name)=>{
        const filename=name.toString('hex')+path.extname(file.originalname);
        cb(null, filename);
      })
    }
  })
  
  //export upload
  const upload = multer({ storage: storage })

  module.exports=upload;