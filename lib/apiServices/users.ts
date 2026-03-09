import axiosInstance from "../service/axios/axios";

export const getUsers = async (params?: Record<string, string>) => {
  try {
    const response = await axiosInstance.get("/user", { params });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: error.message };
  }
};
