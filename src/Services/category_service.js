import { API_URL } from "../Config/config";

export async function addCategoryAPI(args){
    try{
        const NEW_API = API_URL + '/category';
        const requestParams = {
            method:'POST',
            body: args
        };
        const response = await fetch(NEW_API, requestParams)
        console.log(response.status)
        if(response.ok){
            const data = await response.json()
            return {'res':data, 'err':null}
        }
        else{
            const err = await response.json()
            return {'res':null, 'err':err}
        }
    } catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}

export async function getCategoriesAPI(){
    try{
        const NEW_API = API_URL + '/categories/get';
        const requestParams = {
            headers: {'Content-Type': 'application/json'},
            method: 'POST'
        };
        const response = await fetch(NEW_API, requestParams)
        if(response.ok){
            const data = await response.json()
            return {'res':data, 'err':null}
        }
        else{
            const err = await response.json()
            return {'res':[], 'err':err}
        }
    } catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}

export async function deleteCategoryAPI(args){
    try{
        const NEW_API = API_URL + '/category';
        const requestParams = {
            method: 'DELETE',
            body: args
        };
        const response = await fetch(NEW_API, requestParams);
        if(response.ok){
            const data = await response.json()
            return {'res':data, 'err':null}
        }
        else{
            const err = await response.json()
            return {'res':null, 'err':err}
        }
    } catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}
