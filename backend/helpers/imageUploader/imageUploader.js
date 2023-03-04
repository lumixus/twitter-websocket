import path from "path";
import CustomError from "../error/CustomError.js";

export const imageUploader = (req, next)=>
{
    if(req.files)
    {
        const file = req.files.file //the name of file input = file

        let uploadPath = path.join(path.dirname("index.js"), "/public/uploads", file.name);
        
        const allowedMimetypes = ["image/png", "image/jpg", "image/jpeg","video/mp4"];
        
        if(!allowedMimetypes.includes(file.mimetype)){
            return next(new CustomError(400, "Unsupported file type"));
        }
        
        file.mv(uploadPath, function(err){
            
            if(err) {
                return next(err);
            }
        
        });
        
        return file.name;
    }
    else
    {
        return null;
    }
}