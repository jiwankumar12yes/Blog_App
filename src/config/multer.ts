import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const fileFilter=(req:any,file:any,cb:any)=>{
    const filetypes=/jpeg|jpg|png/;
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype=filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: Images Only!');
      }
    };
    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
      });

export default upload;