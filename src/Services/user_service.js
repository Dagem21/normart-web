import { API_URL } from "../Config/config";

export async function loginAPI(args){
    try{
        const NEW_API = API_URL + '/login/get';
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

export async function addUserAPI(args){
    try{
        const NEW_API = API_URL + '/user';
        const requestParams = {
            method:'POST', 
            body: args,
            mode:'cors'
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

export async function getUserAPI(args){
    try{
        const NEW_API = API_URL + '/user/get';
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

export async function getUsersAPI(args){
    try{
        const NEW_API = API_URL + '/users/get';
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

export async function updateUserAPI(args){
    try{
        const NEW_API = API_URL + '/user';
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

export async function deleteUserAPI(args){
    try{
        const NEW_API = API_URL + '/user';
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

export async function getUserCouponsAPI(args){
    try{
        const NEW_API = API_URL + '/usercoupons/get';
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
    } catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}

export async function addUserDetailAPI(args){
    try{
        const NEW_API = API_URL + '/userdetails';
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
    } catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}

export async function getUserDetailAPI(args){
    try{
        const NEW_API = API_URL + '/userdetails/get';
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
    } catch (e) {
        return {'res':null, 'err':'An error has occured!'}
    }
}