import { API_URL } from "../Config/config";

export async function addOrderAPI(args){
    try{
        const NEW_API = API_URL + '/order';
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

export async function getOrderAPI(args){
    try{
        const NEW_API = API_URL + '/order/get';
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

export async function getOrdersAPI(args){
    try{
        const NEW_API = API_URL + '/orders/get';
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

export async function updateOrderAPI(args){
    try{
        const NEW_API = API_URL + '/order';
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

export async function deleteOrderAPI(args){
    try{
        const NEW_API = API_URL + '/order';
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
