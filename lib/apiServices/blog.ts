import axiosInstance from "../service/axios/axios";

// Create Blog
export const createBlog = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/blog", data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// Update Blog
export const updateBlog = async (blogId: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(`/blog/views/${blogId}`, data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// Delete Blog
export const deleteBlog = async (blogId: string) => {
  try {
    const response = await axiosInstance.delete(`/blog/views/${blogId}`);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

// Get Blogs
export const getBlogs = async (params?: Record<string, string | number>) => {
  try {
    const response = await axiosInstance.get("/blog", { params });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
