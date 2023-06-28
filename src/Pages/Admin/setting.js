import '../../Assets/Styles/adminsetting.css'
import '../../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { updateAdminAPI } from '../../Services/admin_service'
import Popup from 'reactjs-popup'
import { checkAdminLogin } from '../../Utils/log'

function AdminSetting() {

    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])
    const [modelopen, setModelOpen] = useState(false)
    const [error, setError] = useState()
    const [newInfo, setNewInfo] = useState({
        'oldpass':'',
        'newpass':'',
        'confpass':''
    })
    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }
    const handleChange = (event) => {
        setNewInfo({...newInfo, [event.target.name]:event.target.value})
    }
    const changePassword = async (event) => {
        event.preventDefault();
        if(newInfo['newpass'] === newInfo['confpass'] && newInfo['oldpass'] !== newInfo['newpass']){
            const form = new FormData()
            form.append('admin_id', admin.current['id'])
            form.append('api_key', admin.current['api_key'])
            form.append('password', newInfo['oldpass'])
            form.append('newpassword', newInfo['newpass'])

            const res = await updateAdminAPI(form)
            if (res['res'] !== null){
                navigate(0)
            }
            else{
                setError(res['err']['error'])
            }
        }
    }
    return <div>
        <Popup open={modelopen} onClose={()=>setModelOpen(false)}>
            <div className="user-popup-container">
                <h2 className='popup-type'>Change Password</h2>
                <div className='user-input-container'>
                <form onSubmit={changePassword}>
                        <input 
                            type='password'
                            id='address'
                            name='oldpass'
                            className="info-input"
                            placeholder='Current Password'
                            required
                            onChange={(e)=>{handleChange(e)}}
                        />
                        <br/>
                        <input 
                            type='password'
                            id='address'
                            name='newpass'
                            className="info-input"
                            placeholder='New Password'
                            required
                            onChange={(e)=>{handleChange(e)}}
                        />
                        <br/>
                        <input 
                            type='password'
                            id='address'
                            name='confpass'
                            className="info-input"
                            placeholder='Confirm Password'
                            required
                            onChange={(e)=>{handleChange(e)}}
                        />
                        <br/>
                        <h2 className='error-message'>{error}</h2>
                        <button type='submit' className="adduser-popup">Update Password</button>
                    </form>
                </div>
            </div>
        </Popup>
        <div className='header'>
            <div className='flex-div'>
                <div className='float'>
                        <h1 className='welcome'>Welcome</h1>
                        <Link to='/admin'>
                            <div className='col-12'>
                                <div className='col-6'>
                                    <img className='normart-image' src={require('../../Assets/Images/normart.png')} alt="Nor Mart"/>
                                </div>
                            </div>
                        </Link>
                        <p className='main-description'>Enjoy our fresh products and amazing packages every day plus great prices you won't 
                        find any where else.</p>
                </div>
            </div>
            <div className='navbar'>
                <ul>
                    <Link to='/admin' className='navbar-item'>Home</Link>
                    <Link to='/admin/orders' className='navbar-item'>Orders</Link>
                    <Link to='/admin/newpackage' className='navbar-item'>New Package</Link>
                    <Link to='/admin/newitem' className='navbar-item'>New Item</Link>
                    <Link to='/admin/newcategory' className='navbar-item'>New Category</Link>
                    <Link to='/admin/newcoupon' className='navbar-item'>New Coupon</Link>
                    <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item selected-nav'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div>
            <div className='admin-setting-container'>
                <label className='setting-input-label'>Username</label>
                <br/>
                <input type='text' className='setting-inputfield' id='name' disabled value={admin.current['name']}/>
                <br/>
                <label className='setting-input-label'>Phone Number</label>
                <br/>
                <input type='text' className='setting-inputfield' id='username' disabled value={admin.current['phone_number']}/>
                <br/>
                <h2 className='add-button' onClick={()=>{setModelOpen(true)}}>Change password</h2>
            </div>
        </div>
    </div>
}

export default AdminSetting;