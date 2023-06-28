import '../Assets/Styles/common.css'
import '../Assets/Styles/setting.css'
import { Link, useNavigate } from 'react-router-dom';
import { FaLocationArrow, FaPlus } from "react-icons/fa";
import { BiLogOut } from 'react-icons/bi';
import { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { addUserDetailAPI, getUserDetailAPI, updateUserAPI } from '../Services/user_service';
import { checkUserLogin } from '../Utils/log';

function Setting(){

    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()
    useEffect(()=>{
        if(!user.current){
            navigate('/', { replace:true})
        }
    }, [navigate])

    const [modelopen, setModelOpen] = useState(false)
    const [popupType, setPopupType] = useState()
    const [newInfo, setNewInfo] = useState({
        'phone':'',
        'address':'',
        'oldpass':'',
        'newpass':'',
        'confpass':''
    })
    const [userInfo, setUserInfo]= useState({
        'phones':[],
        'addresses':[]
    })

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    useEffect(()=>{
        user.current = localStorage.getItem('user');
        if (!user.current){
            navigate('/', {replace:true})
        }
        else{
            user.current = JSON.parse(user.current)
        }
    }, [navigate])

    useEffect(()=>{
        async function initialize () {
            let us = {}
            if(user.current){
                us = user.current
            }
            const form = new FormData()
            form.append('user_id', us['id'])
            const res = await getUserDetailAPI(form)
            const userDetails = res['res']
            if (userDetails){
                const phones = userDetails['phone_numbers']
                const addresses = userDetails['addresses']

                setUserInfo(prev=>{
                    return {...prev, 'phones':phones, 'addresses':addresses}
                })
            }
        }
        initialize();
    }, [])

    const handleChange = (event) => {
        setNewInfo({...newInfo, [event.target.name]:event.target.value})
    }

    const addPhoneNumber = async (event) => {
        event.preventDefault();
        const form = new FormData()
        form.append('datatype', 'phone_number')
        form.append('user_id', user.current['id'])
        form.append('api_key',user.current['api_key'])
        form.append('phone_number', newInfo['phone'])

        const resp = await addUserDetailAPI(form)
        const res = resp['res']
        if (res !== null){
            navigate(0)
        }
    }

    const addAddress = async (event) => {
        event.preventDefault();
        const form = new FormData()
        form.append('datatype', 'address')
        form.append('user_id', user.current['id'])
        form.append('api_key',user.current['api_key'])
        form.append('location', newInfo['address'])

        const resp = await addUserDetailAPI(form)
        const res = resp['res']
        if (res !== null){
            navigate(0)
        }
    }

    const changePassword = async (event) => {
        event.preventDefault();
        if(newInfo['newpass'] === newInfo['confpass'] && newInfo['oldpass'] !== newInfo['newpass']){
            const form = new FormData()
            form.append('user_id', user.current['id'])
            form.append('api_key',user.current['api_key'])
            form.append('password', newInfo['oldpass'])
            form.append('newpassword', newInfo['newpass'])

            const resp = await updateUserAPI(form)
            const res = resp['res']
            if (res !== null){
                navigate(0)
            }
        }
    }

    return <div className='setting-container'>
        <Popup open={modelopen} onClose={()=>setModelOpen(false)}>
            {popupType === 'phone_number'?
                <div className="user-popup-container">
                    <h2 className='popup-type'>Add new phone number</h2>
                    <div className='user-input-container'>
                        <form onSubmit={addPhoneNumber}>
                            <input 
                                type="tel" 
                                id='amount'
                                name='phone'
                                className="info-input"
                                required
                                onChange={(e)=>{handleChange(e)}}
                            />
                            <br/>
                            <button type='submit' className="adduser-popup">Add Phone number</button>
                        </form>
                    </div>
                </div>
                :
                popupType === 'address'?
                <div className="user-popup-container">
                    <h2 className='popup-type'>Add new address</h2>
                    <div className='user-input-container'>
                    <form onSubmit={addAddress}>
                            <input 
                                type="text" 
                                id='address'
                                name='address'
                                className="info-input"
                                required
                                onChange={(e)=>{handleChange(e)}}
                            />
                            <br/>
                            <button type='submit' className="adduser-popup">Add address</button>
                        </form>
                    </div>
                </div>
                :
                popupType === 'change_pass'?
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
                            <button type='submit' className="adduser-popup">Update Password</button>
                        </form>
                    </div>
                </div>:
                <></>
            }
        </Popup>
        <div className='header col-12'>
            <div className='flex-div'>
                <div className='float col-7'>
                    <h1 className='welcome col-3'>Welcome</h1>
                    <img className='normart-image' src={require('../Assets/Images/normart.png')} alt="Nor Mart"/>
                    <p className='main-description'>Enjoy our fresh products and amazing packages every day plus great prices you won't 
                    find any where else.</p>
                </div>
            </div>
            <div className='navbar col-12'>
                <ul className='ul'>
                    <Link to='/' className='navbar-item'>Home</Link>
                    <Link to='/packages' className='navbar-item'>Packages</Link>
                    <Link to='/categories' className='navbar-item'>Categories</Link>
                    <Link to='/populars' className='navbar-item'>Popular</Link>
                    <Link to='/cart' className='navbar-item'>Cart</Link>
                    <Link to='/myorders' className='navbar-item'>My Orders</Link>
                    <Link to='/mycoupons' className='navbar-item'>My Coupons</Link>
                    <Link to='/setting' className='navbar-item selected-nav'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div>
            <div className='names'>
                <label className='setting-input-label'>Name</label>
                <br/>
                <input type='text' className='setting-inputfield' id='name' defaultValue={user.current['name']}/>
                <br/>
                <label className='setting-input-label'>Username</label>
                <br/>
                <input type='text' className='setting-inputfield' id='username' disabled defaultValue={user.current['username']}/>
                <br/>
                <h2 className='add-button' onClick={()=>{setModelOpen(true);setPopupType('change_pass')}}>Change password</h2>
            </div>
            <div className='phones'>
                <label className='setting-input-label phad'>Phone Numbers</label>
                <br/>
                {Object.keys(userInfo['phones']).length>0?
                    userInfo['phones'].map((phone, index)=>{
                        const phone_num = Object.values(phone)[0]
                        return <h2 key={index} className='phone-address'> <FaPlus color='#00D215'/> {phone_num} </h2>
                    }):
                    <h2 className='phone-address'> You have not registered any phone numbers yet.</h2>
                }
                <h2 className='add-button' onClick={()=>{setModelOpen(true);setPopupType('phone_number')}}>Add phone number</h2>
            </div>
            <div className='addresses'>
                <label className='setting-input-label phad'>Addresses</label>
                <br/>
                {Object.keys(userInfo['addresses']).length>0?
                    userInfo['addresses'].map((address, index)=>{
                        const addr = Object.values(address)[0]
                        return <h2 key={index} className='phone-address'><FaLocationArrow color='#00D215'/> {addr} </h2>
                    }):
                    <h2 className='phone-address'> You have not registered any adresses yet.</h2>
                }
                <h2 className='add-button' onClick={()=>{setModelOpen(true);setPopupType('address')}}>Add address</h2>
            </div>
        </div>
    </div>
}

export default Setting;