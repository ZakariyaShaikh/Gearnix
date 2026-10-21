import { healthCheckModel } from "../models/health_models.js";

export const healthCheckService = async () => {
    const result = await healthCheckModel();
    return result ;
}