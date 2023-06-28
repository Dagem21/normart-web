export function addCartPackage(packageid, quantity){
    let packageInCart = localStorage.getItem('packages')
    if (packageInCart){
        packageInCart = JSON.parse(packageInCart)
    }
    else{
        packageInCart = {}
    }
    packageInCart[packageid] = quantity
    localStorage.setItem('packages', JSON.stringify(packageInCart));
    return true
}
export function addCartItem(itemid, quantity){
    let itemInCart = localStorage.getItem('items')
    if (itemInCart){
        itemInCart = JSON.parse(itemInCart)
    }
    else{
        itemInCart = {}
    }
    itemInCart[itemid] = quantity
    localStorage.setItem('items', JSON.stringify(itemInCart));
    return true
}
export function getcartPackages(){
    let packageInCart = localStorage.getItem('packages')
    if (packageInCart){
        packageInCart = JSON.parse(packageInCart)
    }
    else{
        packageInCart = {}
    }
    return packageInCart;
}
export function getcartItems(){
    let itemInCart = localStorage.getItem('items')
    if (itemInCart){
        itemInCart = JSON.parse(itemInCart)
    }
    else{
        itemInCart = {}
    }
    return itemInCart;
}
export function createcart(){
    localStorage.setItem('packages', JSON.stringify({}));
    localStorage.setItem('items', JSON.stringify({}));
}
export function clearCart(){
    localStorage.setItem('packages', JSON.stringify({}));
    localStorage.setItem('items', JSON.stringify({}));
}
export function clearCartItem(){
    localStorage.setItem('items', JSON.stringify({}));
}
export function clearCartPackage(){
    localStorage.setItem('packages', JSON.stringify({}));
}