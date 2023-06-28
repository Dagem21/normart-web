import '../../Assets/Styles/orders.css'
import '../../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { getOrdersAPI } from '../../Services/order_service'
import Popup from 'reactjs-popup'
import OrderDetail from '../../Components/orderdetails'
import { FaCheckCircle } from 'react-icons/fa'
import { checkAdminLogin } from '../../Utils/log'

function Orders() {
    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])
    const [ordersList, setOrdersList] = useState([])
    const [modelopen, setModelOpen] = useState(false)
    const [selectedOrder, setSelecteOrder] = useState('')
    const [selectedOrderIndex, setSelecteOrderIndex] = useState('')
    const [messageopen, setMessageOpen] = React.useState(false)
    useEffect(()=>{
        setOrdersList([])
        async function initialize () {
            const res = await getOrdersAPI();
            const orders = res['res']
            if(Object.keys(orders).length>0){
                setOrdersList(prevstate=>{prevstate=orders; return prevstate;})
            }
        }
        initialize();
    }, [])
    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }
    const childReturn = (delivered) => {
        if(delivered){
            setModelOpen(false);
            setMessageOpen(true);
            const newordersList = ordersList
            newordersList[selectedOrderIndex]['status'] = 'Delivered'
            setOrdersList([...newordersList])
        }
    }
    const orderDetails = (order, index) => {
        setSelecteOrder(order)
        setSelecteOrderIndex(index)
        setModelOpen(true)
    }
    return <div>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> Order has been updated!</h2>
            </div>
        </Popup>
        <Popup open={modelopen} onClose={()=>setModelOpen(false)}>
            <div>
                <OrderDetail
                    orderdelivered = {(stat)=>childReturn(stat)}
                    order = {selectedOrder}
                />
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
                    <Link to='/admin/orders' className='navbar-item selected-nav'>Orders</Link>
                    <Link to='/admin/newpackage' className='navbar-item'>New Package</Link>
                    <Link to='/admin/newitem' className='navbar-item'>New Item</Link>
                    <Link to='/admin/newcategory' className='navbar-item'>New Category</Link>
                    <Link to='/admin/newcoupon' className='navbar-item'>New Coupon</Link>
                    <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='body'>
            <h2 className='orders-label'>Orders</h2>
            <div className='orders-table-container'>
                <table className='orders-table'>
                    <thead className='tablehead'>
                        <tr>
                            <td className='tablehead-column hcol1'>
                                <div className='tablehead-col-div'>
                                    Order ID
                                </div>
                            </td>
                            <td className='tablehead-column hcol2'>
                                <div className='tablehead-col-div'>
                                    Name
                                </div>
                            </td>
                            <td className='tablehead-column hcol3'>
                                <div className='tablehead-col-div'>
                                    Date
                                </div>
                            </td>
                            <td className='tablehead-column hcol4'>
                                <div className='tablehead-col-div'>
                                    Status
                                </div>
                            </td>
                            <td className='tablehead-column hcol5'>
                                <div className='tablehead-col-div'>
                                    Location
                                </div>
                            </td>
                            <td className='tablehead-column hcol6'>
                                <div className='tablehead-col-div'>
                                    Items
                                </div>
                            </td>
                            <td className='tablehead-column hcol7'>
                                <div className='tablehead-col-div'>
                                    Packages
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(ordersList).length>0?
                            ordersList.map((order, index)=>{
                                return <tr className='tablerow' key={index}>
                                    <td className='tablerow-data rcol1'>{order['id']}</td>
                                    <td className='tablerow-data rcol2'>{order['name']}</td>
                                    <td className='tablerow-data rcol3'>{order['date']}</td>
                                    <td className='tablerow-data rcol4'>{order['status']}</td>
                                    <td className='tablerow-data rcol5'>{order['delivery_location']}</td>
                                    <td className='tablerow-data rcol6'>
                                        {order['items'].length>0?
                                            <div className='items-container'>
                                                {order['items']}
                                            </div>:
                                            <></>
                                        }
                                    </td>
                                    <td className='tablerow-data rcol7'>
                                        {order['packages'].length>0?
                                            <div className='packages-container'>
                                                {order['packages']}
                                            </div>:
                                            <></>
                                        }
                                    </td>
                                    <td className='tablerow-data rcol8'>
                                        <button className='order-detail' onClick={()=>{orderDetails(order, index)}}>Details</button>
                                    </td>
                                </tr>
                            }):
                            <></>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default Orders;