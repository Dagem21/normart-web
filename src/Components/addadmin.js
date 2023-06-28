import '../Assets/Styles/addadmin.css'
import '../Assets/Styles/common.css'
import { useState, useRef } from 'react';
import { addAdminAPI } from '../Services/admin_service';
import Popup from 'reactjs-popup';
import { FaCheckCircle } from 'react-icons/fa';
import { checkAdminLogin } from '../Utils/log';

function AddAdminComponent (){

    const admin = useRef()
    admin.current = checkAdminLogin()

    const [messageopen, setMessageOpen] = useState(false)
    const [error, setError] = useState()

    async function createAdmin(args){
        const res = await addAdminAPI(args)
        if(res['res']){
            setMessageOpen(true)
        }
        else{
            setError(res['err']['error'])
        }
    }

    const [adminInfo, setAdminInfo] = useState({
            'name':'',
            'phonenumber':'',
            'priviledge':1,
            'password':''
        })

    const handleChange = (event) => {
        setAdminInfo({...adminInfo, [event.target.name]:event.target.value})
    }

    const createAdminCLicked = (event) => {
        event.preventDefault();
        const form = new FormData()
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        form.append('name', adminInfo['name'])
        form.append('phone_number', adminInfo['phonenumber'])
        form.append('priviledge', adminInfo['priviledge'])
        form.append('password', adminInfo['password'])
        createAdmin(form);
    }

    return <div>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> Admin account has been created!</h2>
            </div>
        </Popup>
        <div className='add-admin-form-container'>
            <h2 className='form-label'>Create new admin account</h2>
            <form className='add-admin-form' onSubmit={createAdminCLicked}>
                <label className='input-label'>Username</label>
                <br/>
                <input 
                    type='text' 
                    className='inputfield' 
                    id='name'
                    name='name'
                    value={adminInfo['name']}
                    onChange={(e)=>{handleChange(e)}}
                    required 
                />
                <br/>
                <label className='input-label'>Phone Number</label>
                <br/>
                <input 
                    type='text' 
                    className='inputfield' 
                    id='phonenumber'
                    name='phonenumber'
                    value={adminInfo['phonenumber']}
                    onChange={(e)=>{handleChange(e)}}
                    required 
                />
                <br/>
                <label className='input-label'>Priviledge</label>
                <select 
                    className='admin-priv' 
                    id='priviledge' 
                    name='priviledge' 
                    defaultValue={adminInfo['priviledge']}
                    onChange={(e)=>{handleChange(e)}}
                >
                    <option value='1'>Limited Priviledge</option>
                    <option value='2'>Full Priviledges</option>
                </select>
                <br/>
                <label className='input-label'>Password</label>
                <br/>
                <input 
                    type='password' 
                    className='inputfield' 
                    id='password'
                    name='password'
                    value={adminInfo['password']}
                    onChange={(e)=>{handleChange(e)}}
                    required 
                />
                <br/>
                <h2 className='error-message'>{error}</h2>
                <button className='submit-button' type='submit'>Create Admin</button>
            </form>
        </div>
    </div>
}

export default AddAdminComponent;