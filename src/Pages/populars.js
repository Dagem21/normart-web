import '../Assets/Styles/populars.css'
import '../Assets/Styles/common.css'
import PopularComp from '../Components/popular';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import Itempopup from '../Components/itempopup';
import { getItemsAPI } from '../Services/item_service';
import { FaCheckCircle } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { checkUserLogin } from '../Utils/log';

function Populars() {

    const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    const [popularList, setPopularList] = useState([])
    const [loading, setLoading] = useState(true)
    const [modelopen, setModelOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState()
    const [messageopen, setMessageOpen] = useState(false)

    useEffect(()=>{
        const bgcolors2 = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
        async function initialize () {
            setPopularList([])
            const items = await getItemsAPI();
            items['res']?
            items['res'].map((item) => {
                const popu = <div className='pop-click' key={item.id} onClick={()=>{setModelOpen(true);setSelectedItem(item)}}>
                    <PopularComp
                        itemId={item.id}
                        image={item.image}
                        name={item.name}
                        discount={item.discount !== null? '$ '+ parseFloat(item.price).toFixed(2) +' Birr' : ''}
                        price={item.discount !== null?'$ '+ parseFloat(item.price-((item.price*item.discount)/100)).toFixed(2) +' Birr' : '$ '+ parseFloat(item.price).toFixed(2) +' Birr'}
                        bgcolor={bgcolors2[Math.floor(Math.random() * bgcolors2.length)]}
                    />
                </div>
                setPopularList(prev => [...prev, popu])
                setLoading(false)
                return ''
                }
            ):<></>
        }
        initialize();
    }, [])

    const childReturn = (added) => {
        if(added){
            setModelOpen(false);
            setMessageOpen(true);
        }
    }

    return <div className='populars-container'>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> Item has been added to your Cart!</h2>
            </div>
        </Popup>
        <Popup open={modelopen} onClose={()=>setModelOpen(false)}>
            {selectedItem?
                <div>
                    <Itempopup
                        cartAdded = {(stat)=>childReturn(stat)}
                        itemId={selectedItem.id}
                        image={selectedItem.image}
                        name={selectedItem.name}
                        discount={selectedItem.discount !== null? '$ '+ parseFloat(selectedItem.price).toFixed(2) +' Birr' : ''}
                        price={selectedItem.discount !== null?
                            '$ '+ parseFloat((selectedItem.price*selectedItem.discount)/100).toFixed(2) +' Birr / '+selectedItem.unit : 
                            '$ '+ parseFloat(selectedItem.price).toFixed(2) +' Birr / '+selectedItem.unit}
                        bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                    />
                </div>:
                <></>
                }
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
                    <Link to='/populars' className='navbar-item selected-nav'>Popular</Link>
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
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
            </div>:
            <div className='populars-list'>
            {popularList.length>0?
                popularList.map((ele)=>{return ele}):<></>
            }
        </div>}
    </div>
}

export default Populars;