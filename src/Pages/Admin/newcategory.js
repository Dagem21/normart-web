import '../../Assets/Styles/newcategory.css'
import '../../Assets/Styles/common.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { FaAsterisk, FaCheckCircle } from 'react-icons/fa'
import Popup from 'reactjs-popup'
import { addCategoryAPI } from '../../Services/category_service'
import { checkAdminLogin } from '../../Utils/log'

function NewCategory() {

    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])

    const initialState = {
        name :'',
        image:'',
        imagedata:'',
        imagename:''
    }

    const [error, setError] = useState()
    const [newcategory, updateNewCategory] = useState( initialState )
    const [messageopen, setMessageOpen] = useState(false)

    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }

    async function createCategory(args){
        const res = await addCategoryAPI(args)
        if(res['res']){
            updateNewCategory(initialState)
            setMessageOpen(true)
        }
        else{
            setError(res['err']['error'])
        }
    }

    const createClicked = (event) => {
        event.preventDefault()
        const form = new FormData();
        form.append('name', newcategory['name']);
        form.append('file', newcategory['image']);
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        createCategory(form);
    }

    const updateCategory = (event) => {
        if(event.target.name === 'image'){
            if(event.target.files[0]){
                updateNewCategory({...newcategory, [event.target.name]:
                    event.target.files[0], 'imagedata':
                    URL.createObjectURL(event.target.files[0]), 'imagename':
                    event.target.value})
            }
            else{
                updateNewCategory({...newcategory, [event.target.name]:'', 'imagedata':'', 'imagename':''})
            }
        }
        else{
            updateNewCategory({...newcategory, [event.target.name]:event.target.value})
        }
    }

    return <div>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> Category has been created!</h2>
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
                    <Link to='/admin/orders' className='navbar-item'>Orders</Link>
                    <Link to='/admin/newpackage' className='navbar-item'>New Package</Link>
                    <Link to='/admin/newitem' className='navbar-item'>New Item</Link>
                    <Link to='/admin/newcategory' className='navbar-item selected-nav'>New Category</Link>
                    <Link to='/admin/newcoupon' className='navbar-item'>New Coupon</Link>
                    <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='body'>
            <h2 className='new-category-label'>Create new category</h2>
            <form onSubmit={createClicked}>
                <div className='new-category-form'>
                    <div className='category-form-col item-from-col-1'>
                        <label className='category-input-label'>Category Name <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='text' 
                            className='category-inputfield item-name' 
                            id='categoryname' 
                            name='name'
                            value={newcategory['name']}
                            onChange={(e) => {updateCategory(e)}}
                            required
                        />
                        <br/>
                        <label className='category-input-label'>Image <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='file'
                            accept='image/png'
                            className='category-inputfield image-upload' 
                            id='image' 
                            name='image'
                            value={newcategory['imagename']}
                            onChange={(e) => {updateCategory(e)}}
                            required
                        />
                        <br/>
                        <h2 className='error-message'>{error}</h2>
                        <button className='create-button-category' type='submit'>Create</button>
                    </div>
                </div>
            </form>
            
        </div>
    </div>
}

export default NewCategory;