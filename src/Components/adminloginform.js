import '../Assets/Styles/common.css'
import '../Assets/Styles/adminloginform.css'
import { adminLoginAPI } from '../Services/admin_service'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLoginForm(){
    const navigate = useNavigate()

    const [error, setError] = useState()

    async function login(args){
        const res = await adminLoginAPI(args)
        const resp = res['res']
        if(resp){
            localStorage.setItem('admin', JSON.stringify({}))
            localStorage.setItem('user', JSON.stringify({}))
            const date = new Date()
            localStorage.setItem('admin', JSON.stringify({...resp, 'login_time': date}));
            navigate(0)
        }
        else{
            setError(res['err']['error'])
        }
    }

    const [adminInfo, setAdminInfo] = useState({
        'phonenumber': '',
        'password':''
    })
    const handleChange = (event) => {
        setAdminInfo({...adminInfo, [event.target.name]:event.target.value})
    }

    const loginCLicked = (event) => {
        event.preventDefault();
        const form = new FormData();
        form.append('phone_number', adminInfo['phonenumber'])
        form.append('password', adminInfo['password'])
        login(form);
    }

    return <div>
        <label className='admin-login-label'>Login to see orders!</label>
        <form className='admin-login-form' onSubmit={loginCLicked}>
            <label className='admin-input-label'>Phone Number</label>
            <br/>
            <input 
                type='tel' 
                className='admin-inputfield' 
                id='phonenumber' 
                name='phonenumber'
                value={adminInfo['phonenumber']}
                onChange={(e)=>{handleChange(e)}}
                required 
            />
            <br/>
            <label className='admin-input-label'>Password</label>
            <br/>
            <input 
                type='password' 
                className='admin-inputfield' 
                id='password' 
                name='password'
                value={adminInfo['password']}
                onChange={(e)=>{handleChange(e)}}
                required 
            />
            <br/>
            <h2 className='error-message'>{error}</h2>
            <button className='admin-login-button' type='submit'>Login</button>
        </form>
    </div>
}

export default AdminLoginForm;