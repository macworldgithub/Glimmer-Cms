import axios from "axios";
import { BACKEND_URL } from "../../config/server";

export const sendEmail = async (recipient :string ,subject:string ,body:string ,token:string)=>{
    const res = await axios.post(`${BACKEND_URL}`,)

    return res.data
}