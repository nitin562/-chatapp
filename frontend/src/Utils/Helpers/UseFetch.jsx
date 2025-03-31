import { useGlobal } from "../Context/Global";
import { fetchHandler } from "./asyncFetch";


export const useFetch = () => {
    const { toast } = useGlobal(); // Get toast from context

    return async (method, url, extra_headers = {}, extra_body = null, csrf = null, isJWT = false) => {
        return await fetchHandler(method, url, extra_headers, extra_body, csrf, isJWT, toast);
    };
};
