import '../Assets/Styles/orderdetail.css'
import { updateOrderAPI } from '../Services/order_service';
import { useEffect, useRef, useState } from 'react'
import { getUserDetailAPI } from '../Services/user_service';

function OrderDetail(props){

    const [phones, setPhones] = useState('')
    const user_id = useRef()
    user_id.current = props.order['user_id']
    useEffect(()=>{
        async function initialize () {
            const form = new FormData()
            form.append('user_id', user_id.current)
            const res = await getUserDetailAPI(form);
            const user = res['res']
            if(user){
                let phones_str = ''
                user['phone_numbers'].map((phone)=>{
                    const number = Object.values(phone)[0]
                    if (phones_str === ''){
                        phones_str = number
                    }
                    else{
                        phones_str += ' '+number
                    }
                    return ''
                })
                setPhones(phones_str)
            }
        }
        initialize();
    }, [])

    const deliveredClicked = async ()=>{
        const form = new FormData()
        form.append('order_id', props.order['id'])
        form.append('status', 'Delivered')
        const res = await updateOrderAPI(form)
        if (res['res']){
            props.orderdelivered(true)
        }
    }
    return <div className="order-popup-container">
        <table className='order-detail-table'>
            <tbody>
                <tr className='detail-div'>
                    <td>
                        <div className='order-info r1-divs'>
                            <h2 className="order-label">Order ID</h2>
                            <h2 className="order-info-value order-id">{props.order['id']}</h2>
                        </div>
                    </td>
                    <td>
                        <div className='order-info r1-divs'>
                            <h2 className="order-label">Status</h2>
                            <h2 className="order-info-value order-status">{props.order['status']}</h2>
                        </div>
                    </td>
                    <td>
                        <div className='order-info r1-divs'>
                            <h2 className="order-label">Date</h2>
                            <h2 className="order-info-value order-date">{props.order['date']}</h2>
                        </div>
                    </td>
                </tr>
                <tr className='detail-div'>
                    <td>
                        <div className='order-info r2-divs'>
                            <h2 className="order-label">Name</h2>
                            <h2 className="order-info-value order-orderer">{props.order['name']}</h2>
                        </div>
                    </td>
                    <td>
                        <div className='order-info r2-divs'>
                            <h2 className="order-label">Phones</h2>
                            <h2 className="order-info-value order-phone">{phones !== ''?
                            phones
                            :
                            ''}</h2>
                        </div>
                    </td>
                    <td>
                        <div className='order-info r2-divs'>
                            <h2 className="order-label">Delivery Location</h2>
                            <h2 className="order-info-value order-location">{props.order['delivery_location']}</h2>
                        </div>
                    </td>
                </tr>
                <tr className='detail-div'>
                    <td colSpan='3'>
                        <div className='order-info r3-divs'>
                            <h2 className="order-label">Items</h2>
                            <h2 className="order-info-value order-items">{props.order['items']}</h2>
                        </div>
                    </td>
                </tr>
                <tr className='detail-div'>
                    <td colSpan='3'>
                        <div className='order-info r4-divs'>
                            <h2 className="order-label">Packages</h2>
                            <h2 className="order-info-value order-packages">{props.order['packages']}</h2>
                        </div>
                    </td>
                </tr>
                <tr className='detail-div'>
                    <td>
                        {props.order['status']==='Delivered'?
                            <></>:
                            <div className='detail-div detail-r5'>
                                <div className='order-info r5-divs'>
                                    <button className='delivered-button' onClick={deliveredClicked}>Delivered</button>
                                </div>
                            </div>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

export default OrderDetail;