import '../Assets/Styles/home.css'
import '../Assets/Styles/common.css'
import { addUserAPI } from '../Services/user_service'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignupForm(){

    const navigate = useNavigate()
    const [error, setError] = useState()

    async function signup(args){
        const res = await addUserAPI(args)
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
        'username': '',
        'password':''
    })
    const handleChange = (event) => {
        setUserInfo({...userInfo, [event.target.name]:event.target.value})
    }

    const signupCLicked = (event) => {
        event.preventDefault();
        const form = new FormData()
        form.append('name', userInfo['name'])
        form.append('username', userInfo['username'])
        form.append('password', userInfo['password'])
        signup(form);
    }

    return <div>
        <h2 className='signup-label'>Join us to day and Get the best deal there is!</h2>
        <form className='signup-form' onSubmit={signupCLicked}>
            <label className='input-label'>Name</label>
            <br/>
            <input 
                type='text' 
                className='inputfield' 
                id='name' 
                name='name'
                value={userInfo['name']}
                onChange={(e)=>{handleChange(e)}}
                required 
            />
            <br/>
            <label className='input-label'>Username</label>
            <br/>
            <input 
                type='text'
                className='inputfield' 
                id='username' 
                name='username'
                value={userInfo['username']}
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
            <button className='submit-button' type='submit'>Sign Up</button>
        </form>
    </div>
}

export default SignupForm;