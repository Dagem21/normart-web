import '../Assets/Styles/myorders.css'
import '../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { useEffect, useRef, useState } from 'react';
import { getOrdersAPI } from '../Services/order_service';
import { checkUserLogin } from '../Utils/log';


function Myorders (){

    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()
    useEffect(()=>{
        if(!user.current){
            navigate('/', { replace:true})
        }
    }, [navigate])

    const [ordersList, setOrdersList] = useState([])
    
    const logout = () => {
        localStorage.clear();
        navigate('/')
    }
    useEffect(()=>{
        setOrdersList([])
        async function initialize () {
            const form = new FormData()
            form.append('user_id', user.current['id'])
            const res = await getOrdersAPI(form)
            const orders = res['res']
            if(Object.keys(orders).length>0){
                setOrdersList(prevstate=>{prevstate=orders; return prevstate;})
            }
        }
        initialize();
    }, [])

    return <div className='myorders-container'>
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
                    <Link to='/myorders' className='navbar-item selected-nav'>My Orders</Link>
                    <Link to='/mycoupons' className='navbar-item'>My Coupons</Link>
                    <Link to='/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='orders-table-container'>
            <table>
                <thead className='tablehead'>
                    <tr>
                        <th className='tablehead-column hcol1'>
                                <div className='tablehead-col-div'>
                                    Date
                                </div>
                            </th>
                            <th className='tablehead-column hcol2'>
                                <div className='tablehead-col-div'>
                                    Status
                                </div>
                            </th>
                            <th className='tablehead-column hcol3'>
                                <div className='tablehead-col-div'>
                                    Location
                                </div>
                            </th>
                            <th className='tablehead-column hcol4'>
                                <div className='tablehead-col-div'>
                                    Items
                                </div>
                            </th>
                            <th className='tablehead-column hcol5'>
                                <div className='tablehead-col-div'>
                                    Packages
                                </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(ordersList).length>0?
                        ordersList.map((order, index)=>{
                            return <tr className='tablerow' key={index}>
                                <td className='tablerow-data rcol1'>{order['date']}</td>
                                <td className='tablerow-data rcol2'>{order['status']}</td>
                                <td className='tablerow-data rcol3'>{order['delivery_location']}</td>
                                <td className='tablerow-data rcol4'>
                                    {order['items'].length>0?
                                        <div className='items-container'>
                                            {order['items']}
                                        </div>:
                                        <></>
                                    }
                                </td>
                                <td className='tablerow-data rcol5'>
                                    {order['packages'].length>0?
                                        <div className='packages-container'>
                                            {order['packages']}
                                        </div>:
                                        <></>
                                    }
                                </td>
                            </tr>
                        }):
                        <></>
                    }
                </tbody>
            </table>
        </div>
    </div>
}

export default Myorders;