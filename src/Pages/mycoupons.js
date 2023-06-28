import '../Assets/Styles/mycoupons.css'
import '../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { useEffect, useRef, useState } from 'react';
import { addUserDetailAPI, getUserCouponsAPI } from '../Services/user_service';
import { FaAsterisk, FaCheckCircle } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import { checkUserLogin } from '../Utils/log';

function Mycoupons (){

    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()
    useEffect(()=>{
        if(!user.current){
            navigate('/', { replace:true})
        }
    }, [navigate])

    const initialState = {
        'tag':'',
        'reason':''
    }
    const [newCoupon, updateNewCoupon] = useState( initialState )
    const [messageopen, setMessageOpen] = useState(false)
    const [error, setError] = useState('')
    const [couponsList, setCouponsList] = useState([])
    
    const logout = () => {
        localStorage.clear();
        navigate('/')
    }
    useEffect(()=>{
        async function initialize () {
            const form = new FormData()
            form.append('user_id', user.current['id'])
            const res = await getUserCouponsAPI(form)
            const coupons = res['res']
            if(Object.keys(coupons).length>0){
                setCouponsList([...coupons])
            }
        }
        initialize();
    }, [])
    const addCoupon = async (args) => {
        const resp = await addUserDetailAPI(args)
        const res = resp['res']
        if (res !== null){
            setMessageOpen(true)
            setError('')
            updateNewCoupon(initialState)
        }
        else{
            setError(resp['err']['error'])
        }
    }
    const addClicked = (event) => {
        event.preventDefault()
        const form = new FormData()
        form.append('datatype', 'coupon')
        form.append('user_id', user.current['id'])
        form.append('tag', newCoupon['tag'])
        form.append('reason', newCoupon['reason'])
        addCoupon(form);
    }
    const updateCoupon = async (event) => {
        updateNewCoupon({...newCoupon, [event.target.name]:event.target.value})
    }

    return <div className='mycoupons-container'>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span>{'You have claimed a coupon. You can use it on your next coupon!'}</h2>
            </div>
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
                    <Link to='/mycoupons' className='navbar-item selected-nav'>My Coupons</Link>
                    <Link to='/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='coupon-form-container'>
            <h2 className='new-coupon-label'>Claim coupon</h2>
            <form onSubmit={addClicked} className='coupon-form'>
                <div className='new-coupon-form'>
                    <div className='coupon-form-col coupon-from-col-1'>
                        <div className='coupon-inputs-container'>
                            <div className='col-divs col1-div'>
                                <label className='coupon-input-label'>Coupon tag <FaAsterisk color='#FF6600' size='9'/></label>
                                <br/>
                                <input 
                                    type='text' 
                                    className='coupon-inputfield coupon-value' 
                                    id='coupontag' 
                                    name='tag'
                                    value={newCoupon['tag']}
                                    onChange={(e) => {updateCoupon(e)}}
                                    required
                                />
                            </div>
                            <div className='col-divs col2-div'>
                                <label className='coupon-input-label'>Reason</label>
                                <br/>
                                <input
                                    type='text'
                                    className='coupon-inputfield pac-active'
                                    id='activedate'
                                    name='activedate'
                                    value={newCoupon['activedate']}
                                    onChange={(e) => {updateCoupon(e)}}
                                />
                            </div>
                            <h2 className='error-message'>{error}</h2>
                            <button className='create-button-item' type='submit'>{'Claim'}</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div className='coupons-table-container'>
            <h2 className='new-coupon-label'>Your coupons</h2>
            <table>
                <thead className='tablehead'>
                    <tr>
                        <th className='tablehead-column hcol1'>
                            <div className='tablehead-col-div'>
                                Tag
                            </div>
                        </th>
                        <th className='tablehead-column hcol2'>
                            <div className='tablehead-col-div'>
                                Value
                            </div>
                        </th>
                        <th className='tablehead-column hcol3'>
                            <div className='tablehead-col-div'>
                                Reusable
                            </div>
                        </th>
                        <th className='tablehead-column hcol4'>
                            <div className='tablehead-col-div'>
                                Expire Date
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(couponsList).length>0?
                        couponsList.map((coupon, index)=>{
                            return <tr className='tablerow' key={index}>
                                <td className='tablerow-data rcol1'>{coupon['tag']}</td>
                                <td className='tablerow-data rcol2'>{coupon['coupon_value']}</td>
                                <td className='tablerow-data rcol3'>{coupon['reusable'] === true?'Yes':'No'}</td>
                                <td className='tablerow-data rcol3'>{coupon['expire_date']}</td>
                            </tr>
                        }):
                        <></>
                    }
                </tbody>
            </table>
        </div>
    </div>
}

export default Mycoupons;