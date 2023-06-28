export function checkAdminLogin(){
    if (localStorage.getItem('admin')){
        const admin = JSON.parse(localStorage.getItem('admin'))
        let session_expire = new Date()
        session_expire = Date.parse(session_expire) - Date.parse('01 Jan 1970 00:30:00 GMT')
        const lastlogin = Date.parse(admin['login_time'])
        if(lastlogin>session_expire){
            const date = new Date()
            localStorage.setItem('admin', JSON.stringify({...admin, 'login_time': date}));
            return admin
        }
        else{
            localStorage.setItem('admin', JSON.stringify({}))
            localStorage.setItem('user', JSON.stringify({}))
            return null
        }
    }
}

export function checkUserLogin(){
    if (localStorage.getItem('user')){
        const user = JSON.parse(localStorage.getItem('user'))
        let session_expire = new Date()
        session_expire = Date.parse(session_expire) - Date.parse('01 Jan 1970 00:30:00 GMT')
        const lastlogin = Date.parse(user['login_time'])
        if(lastlogin>session_expire){
            const date = new Date()
            localStorage.setItem('user', JSON.stringify({...user, 'login_time': date}));
            return user
        }
        else{
            localStorage.setItem('admin', JSON.stringify({}))
            localStorage.setItem('user', JSON.stringify({}))
            return null
        }
    }
}