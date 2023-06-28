import '../../Assets/Styles/newitem.css'
import '../../Assets/Styles/common.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { FaAsterisk, FaCheckCircle } from 'react-icons/fa'
import { FaPercent } from 'react-icons/fa'
import PopularComp from '../../Components/popular'
import { addItemAPI, deleteItemAPI, getItemAPI, updateItemAPI } from '../../Services/item_service'
import Popup from 'reactjs-popup'
import { getCategoriesAPI } from '../../Services/category_service'
import { checkAdminLogin } from '../../Utils/log'

function NewItem() {

    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])

    const initialState = {
        id:'',
        name:'',
        category1:'',
        category2:'',
        category3:'',
        image:'',
        unit:'',
        price:'',
        discount:'',
        taxable:'',
        imagedata:'',
        imagename:'',
        preview:true
    }
    const { state } = useLocation()

    const [error, setError] = useState()
    const [newitem, updateNewItem] = useState( initialState )
    const [name, setName] = useState(newitem['name'])
    const [messageopen, setMessageOpen] = useState(false)
    const [successmessage, setSuccessmessage] = useState('')

    const [categoryList, setCategoryList] = useState(null)

    const load = async (form)=>{
        const res = await getItemAPI(form)
        const itemres = res['res']
        if (itemres){
            updateNewItem({
                id:itemres['id'],
                name:itemres['name'],
                category1:itemres['category1'] === null? '':itemres['category1'],
                category2:itemres['category2'] === null? '':itemres['category2'],
                category3:itemres['category3'] === null? '':itemres['category3'],
                unit:itemres['unit'],
                price:itemres['price'],
                discount:itemres['discount'] === null? '':itemres['discount'],
                taxable:itemres['taxable'] === null? '':itemres['taxable'],
                imagedata:itemres['image'],
                imagename:'',
                preview:false
            })
        }
    }
    useEffect(()=>{
        async function initialize () {
            const categories = await getCategoriesAPI();
            setCategoryList(categories['res']);
            updateNewItem(prevstate => {return {...prevstate, 'category1':categories['res'][0]['name']}})
            if (state){
                const form = new FormData()
                form.append('item_id', state['id'])
                load(form)
            }
        }
        initialize();
    }, [state])
    useEffect(()=>{
        const delay = setTimeout( async ()=>{
            const form = new FormData()
            form.append('item_name', name)
            load(form)
        }, 500)
        return ()=>clearTimeout(delay)
    }, [name])

    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }

    async function createItem(args){
        let resp = null
        if(newitem['id'] === ''){
            resp = await addItemAPI(args)
            setSuccessmessage('Item has been created!')
        }
        else{
            resp = await updateItemAPI(args)
            setSuccessmessage('Item has been updated!')
        }
        if(resp['res']){
            updateNewItem(initialState)
            setMessageOpen(true)
        }
        else{
            setError(resp['err']['error'])
        }
    }
    async function deleteItem(id){
        const form = new FormData()
        form.append('item_id', id)
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        const resp = await deleteItemAPI(form)
        setSuccessmessage('Item has been deleted!')
        if(resp['res']){
            updateNewItem(initialState)
            setMessageOpen(true)
        }
        else{
            setError(resp['err']['error'])
        }
    }

    const createClicked = (event) => {
        event.preventDefault()
        const form = new FormData();
        form.append('item_id', newitem['id'])
        form.append('name', newitem['name']);
        form.append('category1', newitem['category1']);
        form.append('category2', newitem['category2']);
        form.append('category3', newitem['category3']);
        form.append('unit', newitem['unit']);
        form.append('price', newitem['price']);
        form.append('file', newitem['image']);
        form.append('discount', newitem['discount']);
        form.append('taxable', newitem['taxable']);
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        createItem(form);
    }

    const updateItem = async (event) => {
        if(event.target.name === 'image'){
            if(event.target.files[0]){
                updateNewItem({
                    ...newitem, 
                    [event.target.name]:event.target.files[0], 
                    'imagedata':URL.createObjectURL(event.target.files[0]), 
                    'imagename':event.target.value,
                    'preview':true
                })
            }
            else{
                updateNewItem({...newitem, [event.target.name]:'', 'imagedata':'', 'imagename':'', preview:true})
            }
        }
        else if(event.target.name === 'name'){
            updateNewItem({...newitem, [event.target.name]:event.target.value})
            setName(event.target.value)
        }
        else if(event.target.name === 'price' || event.target.name === 'discount'){
            if(parseFloat(event.target.value) < 1){
                updateNewItem({...newitem, [event.target.name]:''})
            }
            else{
                updateNewItem({...newitem, [event.target.name]:event.target.value}) 
            }
        }
        else{
            updateNewItem({...newitem, [event.target.name]:event.target.value})
        }
    }

    return <div>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span>{successmessage}</h2>
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
                    <Link to='/admin/newitem' className='navbar-item selected-nav'>New Item</Link>
                    <Link to='/admin/newcategory' className='navbar-item'>New Category</Link>
                    <Link to='/admin/newcoupon' className='navbar-item'>New Coupon</Link>
                    <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='body'>
            <h2 className='new-item-label'>Create new item</h2>
            <form onSubmit={createClicked}>
                <div className='new-item-form'>
                    <div className='item-form-col item-from-col-1'>
                        <label className='item-input-label'>Item Name <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='text' 
                            className='item-inputfield item-name' 
                            id='itemname' 
                            name='name'
                            value={newitem['name']}
                            onChange={(e) => {updateItem(e)}}
                            required
                        />
                        <br/>
                        <label className='item-input-label'>Category 1 <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <select 
                            className='item-inputfield item-cat1' 
                            id='category1' 
                            name='category1'
                            onChange={(e) => {updateItem(e)}}
                            value={newitem['category1']}
                            required
                        >
                            {
                                categoryList?
                                categoryList.map((category, index) => {
                                    return <option key={index} value={category.name}>{category.name}</option>
                                }):<></>
                            }
                        </select>
                        <br/>
                        <label className='item-input-label'>Category 2</label>
                        <br/>
                        <select 
                            className='item-inputfield item-cat2' 
                            id='category2' 
                            name='category2'
                            onChange={(e) => {updateItem(e)}}
                            value={newitem['category2']}
                        >
                            <option value=''></option>
                            {
                                categoryList?
                                categoryList.map((category, index) => {
                                    return <option key={index} value={category.name}>{category.name}</option>
                                }):<></>
                            }
                        </select>
                        <br/>
                        <label className='item-input-label'>Category 3</label>
                        <br/>
                        <select 
                            className='item-inputfield item-cat3' 
                            id='category3' 
                            name='category3'
                            onChange={(e) => {updateItem(e)}}
                            value={newitem['category3']}
                        >
                            <option value=''></option>
                            {
                                categoryList?
                                categoryList.map((category, index) => {
                                    return <option key={index} value={category.name}>{category.name}</option>
                                }):<></>
                            }
                        </select>
                        <br/>
                        <label className='item-input-label'>Image <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='file'
                            accept='image/png'
                            className='item-inputfield image-upload' 
                            id='image' 
                            name='image'
                            value={newitem['imagename']}
                            onChange={(e) => {updateItem(e)}}
                            required = {newitem['id'] === ''?true:false}
                        />
                        <br/>
                    </div>
                    <div className='item-form-col item-from-col-2'>
                        <label className='item-input-label'>Unit  <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='text'
                            className='item-inputfield item-unit'
                            id='unit'
                            name='unit'
                            value={newitem['unit']}
                            onChange={(e) => {updateItem(e)}}
                            required
                        />
                        <br/>
                        <label className='item-input-label'>Price <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='number' 
                            className='item-inputfield item-price' 
                            id='price' 
                            name='price'
                            value={newitem['price']}
                            onChange={(e) => {updateItem(e)}}
                            required
                        />
                        <br/>
                        <label className='item-input-label'>Discount  <FaPercent color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='number' 
                            className='item-inputfield item-disc' 
                            id='discount' 
                            name='discount'
                            value={newitem['discount']}
                            onChange={(e) => {updateItem(e)}}
                        />
                        <br/>
                        <label className='item-input-label'>Taxable</label>
                        <select className='item-tax' id='taxable' name='taxable'>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                        <br/>
                        <h2 className='error-message'>{error}</h2>
                        <button className='create-button-item' type='submit'>{newitem['id'] === ''?'Create':'Update'}</button>
                        {newitem['id'] === ''?<></>:<button className='delete-button-item' type='button' onClick={()=>{deleteItem(newitem['id'])}}>Delete</button>}
                    </div>
                    <div className='item-form-col item-from-col-3'>
                        <div className='preview-item'>
                            <PopularComp
                                preview={newitem['preview']}
                                image={newitem['imagedata']} 
                                name={newitem['name']===''?'Item Name': newitem['name']}
                                discount=
                                {
                                    newitem['discount']===''?
                                    '': 
                                    newitem['price']===''? 
                                    '':
                                    '$ '+parseFloat(newitem['price']).toFixed(2)+' Birr'
                                }
                                price=
                                {
                                    newitem['price']===''?
                                        '':newitem['discount']===''?
                                            '$ '+parseFloat(newitem['price']).toFixed(2)+' Birr':
                                            '$ '+(parseFloat(newitem['price'])*((100-parseInt(newitem['discount']))/100)).toFixed(2) +' Birr'
                                }
                                bgcolor='#7FC2FD'
                            />
                        </div>
                    </div>
                </div>
            </form>
            
        </div>
    </div>
}

export default NewItem;