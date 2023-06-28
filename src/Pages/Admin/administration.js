import '../../Assets/Styles/administration.css'
import '../../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import AddAdminComponent from '../../Components/addadmin'
import AdminsList from '../../Components/admins'
import UsersList from '../../Components/users'
import { checkAdminLogin } from '../../Utils/log'

function Adminstration() {

    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])

    const [selectedMenu, changeMenu] = useState(<AddAdminComponent/>)

    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }

    return <div>
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
                    <Link to='/admin/adminstration' className='navbar-item selected-nav'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='administration-body'>
            <div className='sidemenu'>
                <h2 className='administration-label'>Administration</h2>
                <button className='option-label' onClick={()=>{changeMenu(<AddAdminComponent/>)}}>Add new admin</button>
                <button className='option-label' onClick={()=>{changeMenu(<AdminsList/>)}}>Admins</button>
                <button className='option-label' onClick={()=>{changeMenu(<UsersList/>)}}>Users</button>
            </div>
            <div className='menu-display'>
                {selectedMenu}
            </div>
        </div>
    </div>
}

export default Adminstration;