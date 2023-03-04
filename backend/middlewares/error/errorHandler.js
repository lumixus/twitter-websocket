import CustomError from "../../helpers/error/CustomError.js"
const errorHandler = (err, req, res, next) =>
{
    let error = new CustomError(err.status || 500, err.message);

    if(err.message == "jwt malformed"){
        error = new CustomError(401, "Your JWT expired or null");
    }
    
    res.status(error.status).json({success:false, message:error.message});
}

export default errorHandler;