import { useEffect, useRef, useState } from 'react';
import '../Assets/Styles/admins.css'
import '../Assets/Styles/common.css'
import { getAdminsAPI } from '../Services/admin_service';

function AdminsList (){

    const [adminsList, setAdminsList] = useState([])

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
            const admins = await getAdminsAPI(form)
            setAdminsList(admins['res'])
        }
        initialize();
    }, [])

    return <div>
        <table className='admins-table'>
            <thead className='tablehead'>
                <tr>
                    <td className='tablehead-column hcol1'>
                        <div className='tablehead-col-div'>
                            Username
                        </div>
                    </td>
                    <td className='tablehead-column hcol1'>
                        <div className='tablehead-col-div'>
                            Phone Number
                        </div>
                    </td>
                    <td className='tablehead-column hcol1'>
                        <div className='tablehead-col-div'>
                            Priviledge
                        </div>
                    </td>
                    <td className='tablehead-column hcol2'>
                        <div className='tablehead-col-div'>
                            Last Login
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                {adminsList.length>0?
                    adminsList.map((admin, index)=>{
                        return <tr key={index} className='tablerow'>
                            <td className='tablerow-data'>{admin['name']}</td>
                            <td className='tablerow-data'>{admin['phone_number']}</td>
                            <td className='tablerow-data'>{admin['priviledge']===1?'Limited Priviledge':'Full Priviledge'}</td>
                            <td className='tablerow-data'>{admin['last_login']}</td>
                        </tr>
                    }):
                    <></>
                }
            </tbody>
        </table>
    </div>
}

export default AdminsList;