import axios from "axios";

export const getallService = async () => {
    try {
        const response = await axios.get("/api/services");
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error);
    }
}