import '../Assets/Styles/home.css'
import '../Assets/Styles/common.css'
import { BiLogOut } from 'react-icons/bi'
import { FaCheckCircle, FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import SignupForm from '../Components/signupform'
import LoginForm from '../Components/loginform'
import PackageComponent from '../Components/package.js'
import CategoryComponent from '../Components/category.js'
import PopularComponent from '../Components/popular.js'
import Itempopup from '../Components/itempopup'
import { getItemsAPI, getItemsSearchAPI } from '../Services/item_service'
import { getPackagesAPI } from '../Services/package_service'
import { getCategoriesAPI } from '../Services/category_service'
import Footer from '../Layouts/Footer/footer'
import { checkUserLogin } from '../Utils/log'
import Loading from '../Components/loadinghome'

function Home() {

    const navigate = useNavigate()

    const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']

    const user = useRef()
    user.current = checkUserLogin()

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    const [modelopen, setModelOpen] = useState(false)
    const [messageopen, setMessageOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState()
    const [form, setForm] = useState('signup')
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [searchList, setSearchList] = useState('')
    const [loading, setLoading] = useState(true)
    const changeForm = ()=>{
        if (form === 'signup'){
            setForm('login')
        } 
        else{
            setForm('signup')
        }
    }
    const childReturn = (added) => {
        if(added){
            setModelOpen(false);
            setMessageOpen(true);
        }
    }
    const initialState = {
        'popularList': [],
        'categoryList': [],
        'packageList': []
    }
    const [listContainer, setListContainer] = useState(initialState)
    useEffect(()=>{
        const changecategory = (cat)=>{
            navigate('/categories', {state: cat})
        }
        const bgcolors2 = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
        async function initialize () {
            const popularslist = []
            const categorieslist = []
            const packageslist = []
            setListContainer({
                'popularList': [],
                'categoryList': [],
                'packageList': []
            })
            const items = await getItemsAPI();
            items['res']?
            items['res'].map((item) => {
                const popu = <div key={item.id} onClick={()=>{setModelOpen(true);setSelectedItem(item)}}>
                    <PopularComponent
                        itemId={item.id}
                        image={item.image}
                        name={item.name}
                        discount={item.discount !== null? '$ '+ parseFloat(item.price).toFixed(2) +' Birr' : ''}
                        price={item.discount !== null?'$ '+ parseFloat(item.price-((item.price*item.discount)/100)).toFixed(2) +' Birr' : '$ '+ parseFloat(item.price).toFixed(2) +' Birr'}
                        bgcolor={bgcolors2[Math.floor(Math.random() * bgcolors2.length)]}
                    />
                </div>
                popularslist.push(popu)
                return ''
                }
            ):<></>
            const categories = await getCategoriesAPI();
            categories['res']?
            categories['res'].map((category, index) => {
                const categ = <div key={index} onClick={()=>{changecategory(category.name)}}>
                    <CategoryComponent
                        image={category.image}
                        name={category.name}
                        bgcolor={bgcolors2[Math.floor(Math.random() * bgcolors2.length)]}
                    />
                </div>
                categorieslist.push(categ)
                return ''
            }):<></>
            const packages = await getPackagesAPI();
            packages['res']?
            packages['res'].map((pack, index) => {
                const packa =  <div key={index}>
                    <PackageComponent
                        cartAdded = {(stat)=>childReturn(stat)}
                        image={pack.image} 
                        title={pack.name}
                        discription={pack.description}
                        bgcolor={bgcolors2[Math.floor(Math.random() * bgcolors2.length)]}
                        id={pack.id}
                        items={pack.items}
                        price={'$ '+ parseFloat(pack.price).toFixed(2) +' Birr'}
                    />
                </div>
                packageslist.push(packa)
                return ''
            }):<></>
            setListContainer(prev => {return {...prev, 'popularList':popularslist, 'categoryList':categorieslist, 'packageList':packageslist}})
            setLoading(false)
        }
        initialize();
    }, [navigate])

    const searchClicked = async (event)=>{
        event.preventDefault()
        const form = new FormData()
        form.append('name', search)
        const res = await getItemsSearchAPI(form)
        if (res['res']){
            const serachres = []
            res['res'].length>0?
            res['res'].map((item) => {
                const popu = <div key={item.id} onClick={()=>{setModelOpen(true);setSelectedItem(item)}}>
                    <PopularComponent
                        itemId={item.id}
                        image={item.image}
                        name={item.name}
                        discount={item.discount !== null? '$ '+ parseFloat(item.price).toFixed(2) +' Birr' : ''}
                        price={item.discount !== null?'$ '+ parseFloat(item.price-((item.price*item.discount)/100)).toFixed(2) +' Birr' : '$ '+ parseFloat(item.price).toFixed(2) +' Birr'}
                        bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                    />
                </div>
                serachres.push(popu)
                return ''
                }):
                <></>
            setSearchList(serachres)
            setShowSearch(true)
        }
        else{
            console.log(res['err'])
        }
    }

    return <div>
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
                            '$ '+ parseFloat(selectedItem.price-((selectedItem.price*selectedItem.discount)/100)).toFixed(2) +' Birr / '+selectedItem.unit : 
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
                    {!user.current ? <Link to='/admin' className='change-user'>Login as an Admin</Link>:<></>}
                </div>
                <div className='float col-5'>
                    {!user.current ? form === 'signup'?<SignupForm />:<LoginForm />:<></>}
                    {!user.current ? form === 'signup'?
                        <h2 className='changeformbtn' onClick={() => {changeForm();}}>
                            Already have an account? Login
                        </h2>:
                        <h2 className='changeformbtn' onClick={() => {changeForm();}}>
                            Don't have an account? Sign Up
                        </h2>:<></>
                    }
                </div>
            </div>
            <div className='navbar col-12'>
                <ul className='ul'>
                    <Link to='/' className='navbar-item selected-nav' onClick={()=>{setShowSearch(false);setSearch('')}}>Home</Link>
                    <Link to='/packages' className='navbar-item'>Packages</Link>
                    <Link to='/categories' className='navbar-item'>Categories</Link>
                    <Link to='/populars' className='navbar-item'>Popular</Link>
                    {!user.current ? <></> : <Link to='/cart' className='navbar-item'>Cart</Link>}
                    {!user.current ? <></> : <Link to='/myorders' className='navbar-item'>My Orders</Link>}
                    {!user.current ? <></> : <Link to='/mycoupons' className='navbar-item'>My Coupons</Link>}
                    {!user.current ? <></> : <Link to='/setting' className='navbar-item'>Setting</Link>}
                    {!user.current ? <></> : <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>}
                    <form className='serach-form' onSubmit={searchClicked}>
                        <input 
                            className='search-input' 
                            type='search' 
                            placeholder='Search...'
                            onChange={(e)=>{setSearch(e.target.value)}}
                            value={search}
                            required
                        />
                        <button className='search-button' type='submit'><FaSearch size='15'/></button>
                    </form>
                </ul>
            </div>
        </div>
        {showSearch?
            <div>
                <h3 className='labels'>Showing search result for: <span className='search-phrase'>{search}</span></h3>
                <div className='search-container'>
                    {searchList.length>0?
                        searchList.map((ele)=>{return ele}):
                        <h3 className='labels'>We couldn't find any result for your search!</h3>
                    }
                </div>
            </div>
            :
            <div>
                <div className='body'>
                    {loading?
                        <div><Loading/></div>:
                        <div>
                        <h3 className='labels'>Packages</h3>
                        <div className='packages'>
                            {listContainer['packageList'].length>0?
                                listContainer['packageList'].map((ele)=>{return ele}):<></>
                            }
                        </div>
                        <h3 className='labels'>Categories</h3>
                        <div className='categories'>
                            {listContainer['categoryList'].length>0?
                                listContainer['categoryList'].map((ele)=>{return ele}):<></>
                            }
                        </div>
                        <h3 className='labels'>Popular</h3>
                        <div className='populars'>
                            {listContainer['popularList'].length>0?
                                listContainer['popularList'].map((ele)=>{return ele}):<></>
                            }
                        </div>
                        </div>
                    }
                </div>
                <Footer/>
            </div>
        }
    </div>
}

export default Home;