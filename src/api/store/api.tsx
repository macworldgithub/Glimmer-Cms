import { BACKEND_URL } from "../../config/server";

import axios from "axios"


export const get_all_store = async (token:string , page_no:number)=>{
    try {
        const response = await axios.get(
          `${BACKEND_URL}/store/get_all_stores?page_no=${page_no}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Bearer token
              "Content-Type": "application/json",
            },
          }
        );
        return response.data; // Return the response data if successful
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data); // Throw error with response data
        }
        throw new Error("An error occurred"); // Generic error
      }
    }