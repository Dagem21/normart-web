import '../Assets/Styles/home.css'
import '../Assets/Styles/common.css'
import { loginAPI } from '../Services/user_service'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginForm(){

    const navigate = useNavigate()
    const [error, setError] = useState()

    async function login(args){
        const res = await loginAPI(args)
        const resp = res['res']
        if(resp){
            localStorage.setItem('admin', JSON.stringify({}))
            localStorage.setItem('user', JSON.stringify({}))
            const date = new Date()
            localStorage.setItem('user', JSON.stringify({...resp, 'login_time': date}));
            navigate(0)
        }
        else{
            setError(res['err']['error'])
        }
    }

    const [userInfo, setUserInfo] = useState({
        'name': '',
        'password':''
    })
    const handleChange = (event) => {
        setUserInfo({...userInfo, [event.target.name]:event.target.value})
    }

    const loginCLicked = (event) => {
        event.preventDefault();
        const form = new FormData()
        form.append('username', userInfo['name'])
        form.append('password', userInfo['password'])
        login(form);
    }

    return <div>
        <h2 className='signup-label'>Login to place an order!</h2>
        <form className='signup-form' onSubmit={loginCLicked}>
            <label className='input-label'>Username</label>
            <br/>
            <input 
                type='text' 
                className='inputfield' 
                id='username' 
                name='name'
                value={userInfo['name']}
                onChange={(e)=>{handleChange(e)}}
                required 
            />
            <br/>
            <label className='input-label'>Password</label>
            <br/>
            <input 
                type='password' 
                className='inputfield' 
                id='password' 
                name='password'
                value={userInfo['password']}
                onChange={(e)=>{handleChange(e)}}
                required 
            />
            <br/>
            <h2 className='error-message'>{error}</h2>
            <button className='login-button' type='submit'>Login</button>
        </form>
    </div>
}

export default LoginForm;