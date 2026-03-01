import axiosInstance from "../service/axios/axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const register = async (
  name: string,
  email: string,
  phone: string,
  password: string,
) => {
  try {
    const response = await axiosInstance.post("/auth/signup", {
      name,
      email,
      phone,
      password,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
