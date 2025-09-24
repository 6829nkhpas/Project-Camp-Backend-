import Apiresponse from "../utils/Apirespose.js";



const healthcheck = (req, res) => {
    try {
        const response = new Apiresponse(200, "Service is healthy");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error in healthcheck:", error);
        
        
    }
}
export default healthcheck;