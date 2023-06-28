import '../Assets/Styles/packages.css'
import '../Assets/Styles/common.css'
import '../Assets/Styles/loading.css'
import { Link, useNavigate } from 'react-router-dom';
import PackageComponent from '../Components/package.js'
import { useRef, useState, useEffect } from 'react';
import { getPackagesAPI } from '../Services/package_service';
import Popup from 'reactjs-popup';
import { FaCheckCircle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { checkUserLogin } from '../Utils/log';

function Packages() {

    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }
    
    const [messageopen, setMessageOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [packageList, setPackageList] = useState([])
    useEffect(()=>{
        const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
        async function initialize () {
            setPackageList([])
            const packages = await getPackagesAPI();
            packages['res']?
            packages['res'].map((pack, index) => {
                const packa =  <div key={index} className='pack-cont'>
                    <PackageComponent
                        cartAdded = {(stat)=>childReturn(stat)}
                        image={pack.image} 
                        title={pack.name}
                        discription={pack.description}
                        bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                        id={pack.id}
                        items={pack.items}
                        price={'$ '+ parseFloat(pack.price).toFixed(2) +' Birr'}
                    />
                </div>
                setPackageList(prev => [...prev, packa])
                setLoading(false)
                return ''
            }):<></>
        }
        initialize();
    }, [])

    const childReturn = (added) => {
        if(added){
            setMessageOpen(true);
        }
    }

    return <div className='packages-page'>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> Package has been added to your Cart!</h2>
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
                    <Link to='/packages' className='navbar-item selected-nav'>Packages</Link>
                    <Link to='/categories' className='navbar-item'>Categories</Link>
                    <Link to='/populars' className='navbar-item'>Popular</Link>
                    {!user.current ? <></> : <Link to='/cart' className='navbar-item'>Cart</Link>}
                    {!user.current ? <></> : <Link to='/myorders' className='navbar-item'>My Orders</Link>}
                    {!user.current ? <></> : <Link to='/mycoupons' className='navbar-item'>My Coupons</Link>}
                    {!user.current ? <></> : <Link to='/setting' className='navbar-item'>Setting</Link>}
                    {!user.current ? <></> : <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>}
                </ul>
            </div>
        </div>
        {loading?
            <div>
                <div className="package-loading"></div>
                <div className="package-loading"></div>
                <div className="package-loading"></div>
            </div>:
            <div className='package-list'>
            {packageList.length>0?
                packageList.map((ele)=>{return ele}):<></>
            }
        </div>}
    </div>
}

export default Packages;