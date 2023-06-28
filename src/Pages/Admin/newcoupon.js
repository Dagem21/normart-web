import '../../Assets/Styles/newcoupon.css'
import '../../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { FaAsterisk, FaCheckCircle, FaEdit } from 'react-icons/fa'
import Popup from 'reactjs-popup'
import { addCouponAPI, deleteCouponAPI, getCouponsAPI, updateCouponAPI } from '../../Services/coupon_service'
import { checkAdminLogin } from '../../Utils/log'
import { AiOutlineDelete } from 'react-icons/ai'

function NewCoupon() {
    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])

    const date = new Date()
    let day = ('0'+date.getDate()).slice(-2)
    let month = ('0'+(date.getMonth()+1)).slice(-2)
    let year = date.getFullYear()
    let currdate = `${year}-${month}-${day}`
    const initialState = {
        'id':'',
        'value':'',
        'activedate':currdate,
        'expiredate':'',
        'reusable':false,
        'index':null
    }
    const [couponsList, setCouponsList] = useState([])
    useEffect(()=>{
        async function initialize () {
            const form = new FormData()
            form.append('admin_id', admin.current['id'])
            form.append('api_key', admin.current['api_key'])
            const res = await getCouponsAPI(form)
            const coupons = res['res']
            if(Object.keys(coupons).length>0){
                setCouponsList(prevstate=>{prevstate=coupons; return prevstate;})
            }
        }
        initialize();
    }, [])
    const [error, setError] = useState()
    const [newCoupon, updateNewCoupon] = React.useState( initialState )
    const [messageopen, setMessageOpen] = React.useState(false)
    const [successmessage, setSuccessmessage] = React.useState('')
    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }
    async function createCoupon(args){
        let resp = null
        let res = null
        if(newCoupon['id'] === ''){
            resp = await addCouponAPI(args)
            res = resp['res']
            setSuccessmessage('Coupon has been created! Tag - '+res['tag'])
            setCouponsList([...couponsList, res])
        }
        else{
            resp = await updateCouponAPI(args)
            res = resp['res']
            setSuccessmessage('Coupon has been updated! Tag - '+res['tag'])
            setCouponsList(prev => {
                prev[newCoupon['index']] = res
                return [...prev]
            })
        }
        if(resp['res']){
            updateNewCoupon(initialState)
            setMessageOpen(true)
        }
        else{
            setError(resp['err']['error'])
        }
    }
    async function deleteCoupon(id, index){
        const form = new FormData()
        form.append('coupon_id', id)
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        const resp = await deleteCouponAPI(form)
        if(resp['res']){
            setSuccessmessage('Coupon has been deleted!')
            setMessageOpen(true)
            setCouponsList(prev=> prev.filter((_, i) => i !== index))
        }
        else{
            setError(resp['err']['error'])
        }
    }
    const createClicked = (event) => {
        event.preventDefault()
        const form = new FormData();
        form.append('coupon_id', newCoupon['id'])
        form.append('coupon_value', newCoupon['value']);
        form.append('start_date', newCoupon['activedate']);
        form.append('expire_date', newCoupon['expiredate']);
        form.append('reusable', newCoupon['reusable']);
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        createCoupon(form);
    }
    const updateCoupon = async (event) => {
        updateNewCoupon({...newCoupon, [event.target.name]:event.target.value})
    }
    const editClicked = (coupon, index) => {
        updateNewCoupon({
            'id':coupon['id'],
            'value':coupon['coupon_value'],
            'activedate':coupon['start_date'],
            'expiredate':coupon['expire_date'],
            'reusable':coupon['reusable'],
            'index': index
        })
    }
    return <div>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span>{successmessage}</h2>
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
                    find any where else.
                    </p>
                </div>
            </div>
            <div className='navbar'>
                <ul>
                    <Link to='/admin' className='navbar-item'>Home</Link>
                    <Link to='/admin/orders' className='navbar-item'>Orders</Link>
                    <Link to='/admin/newpackage' className='navbar-item'>New Package</Link>
                    <Link to='/admin/newitem' className='navbar-item'>New Item</Link>
                    <Link to='/admin/newcategory' className='navbar-item'>New Category</Link>
                    <Link to='/admin/newcoupon' className='navbar-item selected-nav'>New Coupon</Link>
                    <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='body'>
            <h2 className='new-item-label'>Create new coupon</h2>
            <div className='coupon-form-container'>
                <form onSubmit={createClicked}>
                    <div className='new-coupon-form'>
                        <div className='coupon-form-col coupon-from-col-1'>
                            <div className='inputs-container'>
                                <div className='col-divs col1-div'>
                                    <label className='coupon-input-label'>Coupon Value <FaAsterisk color='#FF6600' size='9'/></label>
                                    <br/>
                                    <input 
                                        type='number' 
                                        className='coupon-inputfield coupon-value' 
                                        id='couponvalue' 
                                        name='value'
                                        value={newCoupon['value']}
                                        onChange={(e) => {updateCoupon(e)}}
                                        required
                                    />
                                    <br/>
                                    <label className='coupon-input-label'>Reusable</label>
                                    <br/>
                                    <select 
                                        className='coupon-inputfield coupon-cat3' 
                                        id='reusable' 
                                        name='reusable'
                                        onChange={(e) => {updateCoupon(e)}}
                                    >
                                        <option value={false}>No</option>
                                        <option value={true}>Yes</option>
                                    </select>
                                </div>
                                <div className='col-divs col2-div'>
                                    <label className='coupon-input-label'>Active Date <FaAsterisk color='#FF6600' size='9'/></label>
                                    <br/>
                                    <input
                                        type='date'
                                        className='coupon-inputfield pac-active'
                                        id='activedate'
                                        name='activedate'
                                        value={newCoupon['activedate']}
                                        onChange={(e) => {updateCoupon(e)}}
                                        required
                                    />
                                    <br/>
                                    <label className='coupon-input-label'>Expire Date</label>
                                    <br/>
                                    <input 
                                        type='date' 
                                        className='coupon-inputfield pac-expire' 
                                        id='expiredate' 
                                        name='expiredate'
                                        value={newCoupon['expiredate']}
                                        onChange={(e) => {updateCoupon(e)}}
                                    />
                                </div>
                            </div>
                            <h2 className='error-message'>{error}</h2>
                            <button className='create-button-item' type='submit'>{newCoupon['id'] === ''?'Create':'Update'}</button>
                        </div>
                    </div>
                    
                </form>
            </div>
            <div className='coupons-table-container'>
                <h2 className='new-item-label'>Coupons</h2>
                <div className='table-div'>
                    <table className='coupons-table'>
                        <thead className='tablehead'>
                            <tr>
                                <td className='tablehead-column hcol1'>
                                    <div className='tablehead-col-div'>
                                        ID
                                    </div>
                                </td>
                                <td className='tablehead-column hcol2'>
                                    <div className='tablehead-col-div'>
                                        Tag
                                    </div>
                                </td>
                                <td className='tablehead-column hcol3'>
                                    <div className='tablehead-col-div'>
                                        Value
                                    </div>
                                </td>
                                <td className='tablehead-column hcol4'>
                                    <div className='tablehead-col-div'>
                                        Owner
                                    </div>
                                </td>
                                <td className='tablehead-column hcol5'>
                                    <div className='tablehead-col-div'>
                                        Active Date
                                    </div>
                                </td>
                                <td className='tablehead-column hcol6'>
                                    <div className='tablehead-col-div'>
                                        Expire Date
                                    </div>
                                </td>
                                <td className='tablehead-column hcol7'>
                                    <div className='tablehead-col-div'>
                                        Used
                                    </div>
                                </td>
                                <td className='tablehead-column hcol8'>
                                    <div className='tablehead-col-div'>
                                        Used Date
                                    </div>
                                </td>
                                <td className='tablehead-column hcol9'>
                                    <div className='tablehead-col-div'>
                                        Reusable
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(couponsList).length>0?
                                couponsList.map((coupon, index)=>{
                                    return <tr className='tablerow' key={index}>
                                        <td className='tablerow-data rcol1'>{coupon['id']}</td>
                                        <td className='tablerow-data rcol2'>{coupon['tag']}</td>
                                        <td className='tablerow-data rcol3'>{coupon['coupon_value']}</td>
                                        <td className='tablerow-data rcol4'>{coupon['owner']}</td>
                                        <td className='tablerow-data rcol5'>{coupon['start_date']}</td>
                                        <td className='tablerow-data rcol6'>{coupon['expire_date']}</td>
                                        <td className='tablerow-data rcol7'>{coupon['used']?'Yes':'No'}</td>
                                        <td className='tablerow-data rcol8'>{coupon['used_date']}</td>
                                        <td className='tablerow-data rcol9'>{coupon['reusable'] === true?'Yes':'No'}</td>
                                        <td className='tablerow-data rcol10'><FaEdit onClick={()=>{editClicked(coupon, index)}}/></td>
                                        <td className='tablerow-data rcol11'><AiOutlineDelete className='coup-delete' onClick={()=>{deleteCoupon(coupon['id'], index)}}/></td>
                                    </tr>
                                }):
                                <></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}
export default NewCoupon;