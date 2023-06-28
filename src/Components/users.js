import { useEffect, useRef, useState } from "react";
import { getUsersAPI } from "../Services/user_service";

function UsersList (){

    const [usersList, setUsersList] = useState([])

    const admin = useRef()

    useEffect(()=>{
        admin.current = localStorage.getItem('admin');
        if(admin){
            admin.current = JSON.parse(admin.current)
        }
        else{return window.location.replace('/admin')}
    }, [])

    useEffect(()=>{
        async function initialize () {
            const form = new FormData()
            form.append('admin_id', admin.current['id'])
            form.append('api_key', admin.current['api_key'])
            const users = await getUsersAPI(form)
            setUsersList(users['res'])
        }
        initialize();
    }, [])

    return <div>
        <table className='users-table'>
                <thead className='tablehead'>
                    <tr>
                        <td className='tablehead-column hcol1'>
                            <div className='tablehead-col-div'>
                                Username
                            </div>
                        </td>
                        <td className='tablehead-column hcol1'>
                            <div className='tablehead-col-div'>
                                Name
                            </div>
                        </td>
                        <td className='tablehead-column hcol1'>
                            <div className='tablehead-col-div'>
                                Phone Numbers
                            </div>
                        </td>
                        <td className='tablehead-column hcol1'>
                            <div className='tablehead-col-div'>
                                Addresses
                            </div>
                        </td>
                        <td className='tablehead-column hcol1'>
                            <div className='tablehead-col-div'>
                                Coupons
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {
                        usersList.length>0?
                            usersList.map((user, index)=>{
                                let phones = ''
                                if(user['phone_numbers'].length>0){
                                    user['phone_numbers'].map((phone)=>{
                                        const phone_num = Object.values(phone)[0]
                                        phones === ''?phones = phone_num:phones = phones + ', ' + phone_num
                                        return ''
                                    })
                                }
                                let addresses = ''
                                if(user['addresses'].length>0){
                                    user['addresses'].map((address)=>{
                                        const addr = Object.values(address)[0]
                                        addresses === ''?addresses = addr:addresses = addresses + ', ' + addr
                                        return ''
                                    })
                                }
                                let coupons = ''
                                if(user['coupons'].length>0){
                                    user['coupons'].map((coupon)=>{
                                        const coup = coupon['tag']
                                        coupons === ''?coupons = coup:coupons = coupons + ', ' + coup
                                        return ''
                                    })
                                }
                                return <tr key={index} className='tablerow'>
                                    <td className='tablerow-data'>{user['username']}</td>
                                    <td className='tablerow-data'>{user['name']}</td>
                                    <td className='tablerow-data'>{phones}</td>
                                    <td className='tablerow-data'>{addresses}</td>
                                    <td className='tablerow-data'>{coupons}</td>
                                </tr>
                            }):
                            <></>
                    }
                </tbody>
            </table>
    </div>
}

export default UsersList;