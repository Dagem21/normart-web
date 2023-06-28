import '../Assets/Styles/categories.css'
import '../Assets/Styles/common.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryComp from '../Components/category';
import SelectedCategory from '../Components/selectedCategory';
import React, { useRef, useState } from 'react';
import { getCategoriesAPI } from '../Services/category_service';
import { BiLogOut } from 'react-icons/bi';
import { checkUserLogin } from '../Utils/log';
import LoadingCategory from '../Components/loadingcategories';

function Category() {

    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }

    const { state } = useLocation()
    const [loading, setLoading] = useState(true)

    const [categoryList, setCategoryList] = React.useState([])
    const [selectedCategory, setSelectedCategory] = React.useState('')
    React.useEffect(()=>{
        const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
        async function initialize () {
            setCategoryList([])
            const categories = await getCategoriesAPI();
            categories['res']?
            categories['res'].map((category, index) => {
                const categ = <div key={index} onClick={()=>{changecategory(category.name)}}>
                    <CategoryComp
                    image={category.image}
                    name={category.name}
                    bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                />
                </div>
                setCategoryList(prev => [...prev, categ])
                setLoading(false)
                return ''
            }):<></>
            if (state){
                setSelectedCategory(state)
            }
            else{
                if(categories['res'].length>0){
                    setSelectedCategory(categories['res'][0].name)
                }
            }
        }
        initialize();
    }, [state])
    const changecategory = (cat)=>{
        setSelectedCategory(cat)
    }

    return <div className='categories-container'>
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
                    <Link to='/categories' className='navbar-item selected-nav'>Categories</Link>
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
            <div><LoadingCategory/></div>:
            <div>
                <div className='category-list'>
                {categoryList.length>0?
                    categoryList.map((ele)=>{return ele}):<></>
                }
                </div>
                <SelectedCategory category={selectedCategory}/>
            </div>
        }
    </div>
}

export default Category;