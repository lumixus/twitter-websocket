import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, //5 minutes
    max: 60, //limit each ip to 60 requests for 5 minues
    standardHeaders:true,
    legacyHeaders:false
});


export default limiter;