import { healthCheckService } from "../services/health_check_service.js";

export const healthCheckController = async (req, res) => {
    try {
        const data = await healthCheckService();

       return res.status(200).json({
            success : true , 
            message : "Gearnix connected successfully.",
            result : data
        })
    } catch (error) {
        console.log(`Database connection failed : ${error.message}`)
       return res.status(500).json({
        success : false , 
        message : `Database connection failed`
       })
    }
}