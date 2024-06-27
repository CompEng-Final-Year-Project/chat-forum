import axios from "axios";

export const baseUrl = `${import.meta.env.VITE_BASEURL}/api`;

export const postRequest = async (url: string, body: BodyInit) => {
  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      const message = data?.error ? data.error : data;
      return { error: true, message };
    } else {
      return { error: true, message: (error as Error).message };
    }
  }
};

export const getRequest = async (url: string) => {
  try {
    const response = await axios.get(url, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      const message = data?.error? data.error : data;
      return { error: true, message };
    } else {
      return { error: true, message: (error as Error).message };
    }
  }
}