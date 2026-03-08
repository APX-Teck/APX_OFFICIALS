import axiosInstance from "../service/axios/axios";

export const getServices = async (params?: Record<string, string>) => {
  try {
    const response = await axiosInstance.get("/services", { params });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const createService = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/services", data);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const updateService = async (id: number, data: FormData) => {
  try {
    const response = await axiosInstance.put(`/services/${id}`, data);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: error.message };
  }
};

export const deleteService = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: error.message };
  }
};
