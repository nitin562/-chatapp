import { apiLinks } from "../../links"
import { fetchHandler } from "./asyncFetch"

export const get_csrf_token=async()=>{
    return await fetchHandler("GET",apiLinks.get_csrf_token)
}