import { apiLinks } from "../../links"
import { asyncFetch } from "./asyncFetch"

export const get_csrf_token=async()=>{
    return await asyncFetch("GET",apiLinks.get_csrf_token)
}