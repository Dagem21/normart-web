import { API_URL } from "../Config/config";

export async function adminLoginAPI(args){
    try {
        const NEW_API = API_URL + '/adminlogin/get';
        const requestParams = {
            method:'POST', 
            body: args
        };
        const response = await fetch(NEW_API, requestParams)
        if (response.ok){
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

export async function addAdminAPI(args){
    try {    
        const NEW_API = API_URL + '/admin';
        const requestParams = {
            method:'POST',  
            body: args
        };
        const response = await fetch(NEW_API, requestParams)
        if(response.ok){
            const data = await response.json()
            return {'res':data, 'err':null}
        }
        else{
            const err = await response.json()
            return {'res':null, 'err':err}
        }
    }catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}

export async function getAdminAPI(args){
    try{
        const NEW_API = API_URL + '/admin/get';
        const requestParams = {
            method: 'POST',
            body: args
        };
        const response = await fetch(NEW_API, requestParams)
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

export async function getAdminsAPI(args){
    try{
        const NEW_API = API_URL + '/admins/get';
        const requestParams = {
            method: 'POST',
            body: args
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

export async function updateAdminAPI(args){
    try{
        const NEW_API = API_URL + '/admin';
        const requestParams = {
            method: 'PUT',
            body: args
        };
        const response = await fetch(NEW_API, requestParams)
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

export async function deleteAdminAPI(args){
    try{
        const NEW_API = API_URL + '/admin';
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
