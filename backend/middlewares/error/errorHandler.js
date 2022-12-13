import CustomError from "../../helpers/error/CustomError.js"
const errorHandler = (err, req, res, next) =>
{
    let error = new CustomError(err.status || 500, err.message);
    res.status(error.status).json({success:false, message:error.message});
}

export default errorHandler;