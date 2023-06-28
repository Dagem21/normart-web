import '../../Assets/Styles/home.css'
import '../../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import PackageComponent from '../../Components/package.js'
import CategoryComponent from '../../Components/category.js'
import PopularComponent from '../../Components/popular.js'
import AdminLoginForm from '../../Components/adminloginform'
import { getItemsAPI, getItemsSearchAPI } from '../../Services/item_service'
import { getPackagesAPI } from '../../Services/package_service'
import { getCategoriesAPI } from '../../Services/category_service'
import Footer from '../../Layouts/Footer/footer'
import { checkAdminLogin } from '../../Utils/log'
import Loading from '../../Components/loadinghome'
import { FaSearch } from 'react-icons/fa'

function AdminHome() {

    const navigate = useNavigate()
    const admin = checkAdminLogin()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [searchList, setSearchList] = useState('')
    const initialState = {
        'popularList': [],
        'categoryList': [],
        'packageList': []
    }
    const [listContainer, setListContainer] = useState(initialState)
    useEffect(()=>{
        const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
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
                const popu = <div key={item.id} onClick={()=>{navigate('/admin/newitem', {state: item})}}>
                        <PopularComponent
                            itemId={item.id}
                            image={item.image}
                            name={item.name}
                            discount={item.discount !== null? '$ '+ parseFloat(item.price).toFixed(2) +' Birr' : ''}
                            price={item.discount !== null?'$ '+ parseFloat(item.price-((item.price*item.discount)/100)).toFixed(2) +' Birr' : '$ '+ parseFloat(item.price).toFixed(2) +' Birr'}
                            bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                        />
                    </div>
                popularslist.push(popu)
                return ''
                }
            ):<></>
            const categories = await getCategoriesAPI();
            categories['res']?
            categories['res'].map((category, index) => {
                const categ = <div key={index}>
                        <CategoryComponent 
                            image={category.image}
                            name={category.name}
                            bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                        />
                    </div>
                categorieslist.push(categ)
                return ''
            }):<></>
            const packages = await getPackagesAPI();
            packages['res']?
            packages['res'].map((pack, index) => {
                const packa = <div key={index} onClick={()=>{navigate('/admin/newpackage', {state: pack})}}>
                    <PackageComponent
                        cartAdded = {(stat)=>{}}
                        image={pack.image} 
                        title={pack.name}
                        discription={pack.description}
                        bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
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

    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }
    const searchClicked = async (event)=>{
        event.preventDefault()
        const form = new FormData()
        form.append('name', search)
        const res = await getItemsSearchAPI(form)
        if (res['res']){
            const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
            '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
            const serachres = []
            res['res'].length>0?
            res['res'].map((item) => {
                const popu = <div key={item.id} onClick={()=>{navigate('/admin/newitem', {state: item})}}>
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
        <div className='header col-12'>
            <div className='flex-div'>
                <div className='float col-7'>
                    <h1 className='welcome col-3'>Welcome</h1>
                    <img className='normart-image' src={require('../../Assets/Images/normart.png')} alt="Nor Mart"/>
                    <p className='main-description'>Enjoy our fresh products and amazing packages every day plus great prices you won't 
                    find any where else.</p>
                    {!admin?<Link to='/' className='change-user'>Login as a Customer</Link>:<></>}
                </div>
                <div className='float col-5'>
                    <div></div>
                    {!admin? <AdminLoginForm />:<></>}
                </div>
            </div>
            {admin?
                <div className='navbar col-12'>
                    <ul>
                        <Link to='/admin' className='navbar-item selected-nav' onClick={()=>{setShowSearch(false);setSearch('')}}>Home</Link>
                        <Link to='/admin/orders' className='navbar-item'>Orders</Link>
                        <Link to='/admin/newpackage' className='navbar-item'>New Package</Link>
                        <Link to='/admin/newitem' className='navbar-item'>New Item</Link>
                        <Link to='/admin/newcategory' className='navbar-item'>New Category</Link>
                        <Link to='/admin/newcoupon' className='navbar-item'>New Coupon</Link>
                        <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                        <Link to='/admin/setting' className='navbar-item'>Setting</Link>
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
                        <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                    </ul>
                </div>:
                <></>
            }
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
                <Footer />
            </div>
        }
    </div>
}

export default AdminHome;