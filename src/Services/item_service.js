import { API_URL } from "../Config/config";

export async function addItemAPI(args){
    try{
        const NEW_API = API_URL + '/item';
        const requestParams = {
            method:'POST',
            body: args
        };
        console.log(NEW_API)
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

export async function getItemAPI(args){
    try{
        const NEW_API = API_URL + '/item/get';
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

export async function getItemsAPI(args){
    try{
        const NEW_API = API_URL + '/items/get';
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

export async function getItemsSearchAPI(args){
    try{
        const NEW_API = API_URL + '/items/search/get';
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

export async function updateItemAPI(args){
    try{
        const NEW_API = API_URL + '/item';
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

export async function deleteItemAPI(args){
    try{
        const NEW_API = API_URL + '/item';
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
