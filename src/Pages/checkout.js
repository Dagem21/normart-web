import '../Assets/Styles/common.css'
import '../Assets/Styles/checkout.css'
import { Link, useNavigate } from "react-router-dom";
import { FaLocationArrow } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { clearCart, getcartItems, getcartPackages } from '../Services/cart_service';
import { getItemsAPI } from '../Services/item_service';
import { getPackagesAPI } from '../Services/package_service';
import { BiLogOut } from 'react-icons/bi';
import { addOrderAPI } from '../Services/order_service';
import { getUserDetailAPI } from '../Services/user_service';
import Popup from 'reactjs-popup';
import { updateCouponAPI } from '../Services/coupon_service';
import { addPaymentAPI } from '../Services/payment_service';
import { checkUserLogin } from '../Utils/log';

function Checkout(){

    const navigate = useNavigate()

    const user = useRef()
    user.current = checkUserLogin()
    useEffect(()=>{
        if(!user.current){
            navigate('/', { replace:true})
        }
    }, [navigate])

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    const [itemToAmount, setItemToAmount] = useState({})
    const [packageToAmount, setPackageToAmount] = useState([])
    const [modelopen, setModelOpen] = useState(false)
    const [userInfo, setUserInfo]= useState({
        'phones':[],
        'addresses':[],
        'coupons':[]
    })
    const [deliveryLocation, setDeliveryLocation] = useState('')
    const [coupon, setCoupon] = useState({})
    const [error, setError] = useState()

    useEffect(()=>{
        setItemToAmount({})
        setPackageToAmount([])
        async function initialize () {
            const form = new FormData()
            form.append('user_id', user.current['id'])
            const res = await getUserDetailAPI(form)
            const userDetails = res['res']
            if (userDetails){
                const phones = userDetails['phone_numbers']
                const addresses = userDetails['addresses']
                const coupons = userDetails['coupons']
                setUserInfo(prev=>{
                    return {...prev, 'phones':phones, 'addresses':addresses, 'coupons':coupons}
                })
                if (addresses.length>0){
                    setDeliveryLocation(addresses[0][1])
                }
                else{
                    setDeliveryLocation('')
                }
            }
            const itemsincart = getcartItems();
            if(Object.keys(itemsincart).length>0){
                const keys = Object.keys(itemsincart);
                const form = new FormData()
                form.append('id_list', keys)
                const res = await getItemsAPI(form)
                const items = res['res']
                setItemToAmount(prevstate => {
                    prevstate = prevstate === undefined? {}:prevstate
                    
                    items.forEach(item => {
                        const categoryname = item['category1']
                        const itemwithamount = item
                        itemwithamount['amount'] = itemsincart[item.id]
                        if ([categoryname] in prevstate){
                            const category = prevstate[[categoryname]]
                            const newstate = {...prevstate}
                            newstate[[categoryname]] = [...category, itemwithamount]
                            prevstate = newstate
                        }
                        else{
                            const newstate = {...prevstate}
                            newstate[[categoryname]] = [itemwithamount]
                            prevstate = newstate
                        }
                    })
                    return prevstate
                });
            }

            const packagesincart = getcartPackages();
            if (Object.keys(packagesincart).length>0){
                const pack_keys = Object.keys(packagesincart);
                const pack_form = new FormData()
                pack_form.append('id_list', pack_keys)
                const res = await getPackagesAPI(pack_form)
                const packages = res['res']
                setPackageToAmount(prevstate => {
                    packages.forEach(pack => {
                        const packagewithamount = pack
                        packagewithamount['amount'] = packagesincart[pack.id]
                        let newstate = []
                        if (prevstate.length === 0){
                            newstate = [packagewithamount]
                        }
                        else{
                            newstate = prevstate
                            newstate = [packagewithamount]
                        }
                        prevstate = newstate
                    })
                    return prevstate
                });
            }
        }
        initialize();
    }, [])

    const changeLocation = (event) => {
        event.preventDefault()
        setModelOpen(false)
    }

    var total = 0
    var totalWOCoupon = 0
    Object.values(itemToAmount).map(itemlist => itemlist.map(item => totalWOCoupon+=(parseInt(item['amount'])*parseFloat(item['price']))))
    packageToAmount.map(pack => totalWOCoupon+=(parseInt(pack['amount'])*parseFloat(pack['price'])))
    total = totalWOCoupon
    if (Object.keys(coupon).length>0){
        total = totalWOCoupon - parseInt(coupon['coupon_value'])
        if(total<0){total=0}
    }

    const handleOrder = async()=>{
        let itemsString = ''
        let packagesString = ''
        if(Object.keys(itemToAmount).length > 0){
            Object.values(itemToAmount).map(itemlist => {
                itemlist.map(item => {
                    itemsString === ''?
                    itemsString = item['name'] + ' - ' + item['amount'] +' '+ item['unit']:
                    itemsString = itemsString + ', ' + item['name'] + ' - ' + item['amount'] +' '+ item['unit']
                    return ''
                });
                return ''
            })
        }
        if(packageToAmount.length > 0){
            packageToAmount.map(pack => {
                packagesString === ''?
                packagesString = pack['name'] + ' - ' + pack['amount']:
                packagesString = packagesString + ', ' + pack['name'] + ' - ' + pack['amount']
                return ''
            })
        }
        if (itemsString !== '' || packagesString !== ''){
            const date = new Date()
            let day = date.getDate()
            let month = date.getMonth()+1
            let year = date.getFullYear()
            let currdate = `${year}-${month}-${day}`
            const form = new FormData()
            form.append('user_id', user.current['id'])
            if(itemsString !== ''){
                form.append('items', itemsString)
            }
            if(packagesString !== ''){
                form.append('packages', packagesString)
            }
            if (deliveryLocation === '' || userInfo['phones'].length === 0){
                setError('Your delivery adrress or Phone numer is missing! You can go to settings and add them.')
            }
            else{
                form.append('date', currdate)
                if(total === 0){form.append('status', 'Payment Complete')}
                else{form.append('status', 'Pending Payment')}
                form.append('status', 'Pending Payment')
                form.append('delivery_location', deliveryLocation)
                const res = await addOrderAPI(form)
                const order = res['res']
                if (order !== null){
                    if (Object.keys(coupon).length>0){
                        const coup_form = new FormData()
                        coup_form.append('coupon_id', coupon['id'])

                        if(coupon['reusable']){
                            let remaining = coupon['coupon_value']>totalWOCoupon?coupon['coupon_value']-totalWOCoupon:0
                            setCoupon({...coupon, 'coupon_value':remaining})
                            coup_form.append('coupon_value', remaining)
                        }
                        else{
                            setCoupon({...coupon, 'used':true})
                            coup_form.append('used', true)
                        }
                        coup_form.append('used_date', currdate)
                        const cresr = await updateCouponAPI(coup_form)
                        const cres = cresr['res']
                        if (cres !== null){
                            totalWOCoupon = total
                        }
                    }
                    const pay_form = new FormData()
                    pay_form.append('order_id', order['id'])
                    pay_form.append('price', totalWOCoupon)
                    pay_form.append('payed', false)
                    pay_form.append('date', currdate)
                    const pres = await addPaymentAPI(pay_form)
                    const pay_res = pres['res']
                    if(pay_res['res'] !== null){
                        clearCart()
                        navigate('/myorders', {replace:true})
                    }
                }
                else{
                    setError(res['err'])
                }
            }
        }
    }

    return <div className="checkout-container">
        <Popup open={modelopen} onClose={()=>setModelOpen(false)}>
            {
                <div className="change-address-container">
                    <h2 className='popup-type'>Change delivery location</h2>
                    <div className='user-input-container'>
                        <form onSubmit={changeLocation}>
                            <select 
                                className='item-inputfield item-cat1' 
                                id='category1' 
                                name='category1'
                                value={deliveryLocation}
                                onChange={(e)=>{setDeliveryLocation(e.target.value)}}
                            >
                                {
                                    userInfo['addresses'].length>0?
                                    userInfo['addresses'].map((address, index) => {
                                        return <option key={index} value={address[1]}>{address[1]}</option>
                                    }):<></>
                                }
                            </select>
                            <button type='submit' className="adduser-popup">Update</button>
                        </form>
                    </div>
                </div>
            }
        </Popup>
        <Link to='/'>
            <img className='normart-image-navbar' src={require('../Assets/Images/normart.png')} alt="Nor Mart"/>
        </Link>
        <div className='navbar'>
            <ul>
                <Link to='/' className='navbar-item'>Home</Link>
                <Link to='/packages' className='navbar-item'>Packages</Link>
                <Link to='/categories' className='navbar-item'>Categories</Link>
                <Link to='/populars' className='navbar-item'>Popular</Link>
                <Link to='/cart' className='navbar-item'>Cart</Link>
                <Link to='/myorders' className='navbar-item'>My Orders</Link>
                <Link to='/mycoupons' className='navbar-item'>My Coupons</Link>
                <Link to='/setting' className='navbar-item'>Setting</Link>
                <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
            </ul>
        </div>
        <div className='shipping-div'>
            <div>
                <h2 className='title-label'>Shipping Location</h2>
                <button className='edit-shipping' onClick={()=>{if(userInfo['addresses'].length>0){setModelOpen(true)}}}>Edit</button>
            </div>
            <FaLocationArrow className='loc-icon' size='30' color='#00D215'/>
            <div className='info-div'>
                <h2 className='shipping-info'>{user.current['name']}</h2>
                <h2 className='shipping-info'>{userInfo['phones'].length>0?userInfo['phones'][0][1]:''}</h2>
                <h2 className='shipping-info'>{deliveryLocation}</h2>
            </div>
        </div>
        {Object.keys(itemToAmount).length === 0 && packageToAmount.length === 0?
        <h2 className='empty-cart'>Your cart is empty! Add some products to your cart.</h2>:
        <div className='checkout-table-container'>
            <h2 className='title-label'>Order Summary</h2>
            <div className='cart-table-container'>
                <table>
                    <tbody>
                        {itemToAmount !== {}?
                            Object.keys(itemToAmount).map((category, index) => {
                                const items = itemToAmount[[category]].map((item, index) => {
                                    return <td key={index} className='tablerow-item rcol2' >
                                        {item['name']}
                                        <h2 className='item-total-price'>Total :</h2>
                                        <h2 className='item-total-price-value'>{item['amount']} x {item['price']} = {(parseFloat(item['price'])*parseInt(item['amount'])).toFixed(2)} Birr</h2>
                                    </td>
                                });
                                return <tr key={index} className='tablerow'>
                                    <td className='tablerow-cat rcol1'>{category}</td>
                                    {items}
                                </tr>
                                
                            }):
                            <></>
                        }
                        {packageToAmount.length>0?
                            <tr className='tablerow'>
                                <td className='tablerow-cat rcol1'>Packages</td>
                                {packageToAmount.map((pack, index) => {
                                    return <td key={index} className='tablerow-item rcol2'>
                                        {pack['name']}
                                    <h2 className='item-total-price'>Total :</h2>
                                    <h2 className='item-total-price'>{pack['amount']} x {pack['price']} = {(parseFloat(pack['price'])*parseInt(pack['amount'])).toFixed(2)} Birr</h2>
                                    </td>
                                })}
                            </tr>
                            :
                            <></>
                        }
                    </tbody>
                </table>
            </div>
            <div className='total-payment'>
                <label className='pac-input-label'>Coupon : </label>
                <select 
                    className='tag-inputfield tag-name' 
                    id='tag' 
                    name='tag'
                    onChange={(event)=>{setCoupon(JSON.parse(event.target.value))}}
                >
                    <option value='{}'></option>
                    {
                        userInfo['coupons'].length>0?
                        userInfo['coupons'].map((coupon, index) => {
                            return <option key={index} value={JSON.stringify(coupon)}>
                                {coupon['tag']}
                            </option>
                        }):<></>
                    }
                </select>
            </div>
            <div className='total-payment'>
                <h2 className='item-total-price'>Total : <span className='price-span'>$ {total.toFixed(2)}</span> Birr</h2>
                <h2 className='error-message'>{error}</h2>
                <button className='to-payment-button' onClick={handleOrder}>Payment</button>
            </div>
        </div>
        }
    </div>
}

export default Checkout;