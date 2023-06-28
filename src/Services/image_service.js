import { API_URL } from "../Config/config";

export async function getImageAPI(args){
    const NEW_API = API_URL + '/image';
    const requestParams = {
        method: 'POST',
        body: args
    };
    const response = await fetch(NEW_API, requestParams)
    if(response.ok){
        return response.blob()
    }
    else{
        return null
    }
}
