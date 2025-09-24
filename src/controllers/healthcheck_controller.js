import Apiresponse from "../utils/Apirespose.js";
import asynchandler from "../utils/asynchandler.js";



const healthcheck = asynchandler(async (req, res) => {
    const response = new Apiresponse(200, "Service is healthy");
    res.status(200).json(response);
});

export default healthcheck;