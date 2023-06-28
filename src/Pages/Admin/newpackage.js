import '../../Assets/Styles/newpackage.css'
import '../../Assets/Styles/common.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'
import { FaAsterisk , FaCheckCircle, FaPlus } from 'react-icons/fa'
import PackageComp from '../../Components/package'
import { addPackageAPI, deletePackageAPI, getPackageAPI, updatePackageAPI } from '../../Services/package_service'
import Popup from 'reactjs-popup'
import { getItemsAPI } from '../../Services/item_service'
import { checkAdminLogin } from '../../Utils/log'

function NewPackage() {

    const navigate = useNavigate()
    const admin = useRef()
    admin.current = checkAdminLogin()
    useEffect(()=>{
        if(!admin.current){
            navigate('/admin', { replace:true})
        }
    }, [navigate])
    const { state } = useLocation()

    
    const logout = () => {
        localStorage.clear();
        navigate('/admin')
    }
    const date = new Date()
    let day = ('0'+date.getDate()).slice(-2)
    let month = ('0'+(date.getMonth()+1)).slice(-2)
    let year = date.getFullYear()
    let currdate = `${year}-${month}-${day}`
    const initialState = {
        'id':'',
        'name' :'',
        'description':'',
        'image':'',
        'activedate':currdate,
        'expiredate':'',
        'price':'',
        'items':'',
        'setitems':'',
        'imagedata':'',
        'imagefile':'',
        'preview':true
    }
    const [itemsList, setItemsList] = useState()
    const initial = {'itemname':null,'amount':null, 'unit':null}
    const [selectedItem, setSelectedItem] = useState(initial)
    const [packageItems, setPackageItems] = useState({})

    const [error, setError] = useState()
    const [newpackage, updateNewPackage] = useState( initialState )
    const [name, setName] = useState(newpackage['name'])
    const [messageopen, setMessageOpen] = useState(false)
    const [successmessage, setSuccessmessage] = useState('')

    const load = async (form) => {
        const res = await getPackageAPI(form)
        const packres = res['res']
        if (packres){
            updateNewPackage({
                'id':packres['id'],
                'name' :packres['name'],
                'description':packres['description'],
                'activedate':packres['start_date'],
                'expiredate':packres['expire_date'],
                'price':packres['price'],
                'items':packres['items'],
                'setitems':packres['items'],
                'imagedata':packres['image'],
                'image':'',
                'preview':false
            })
        }
    }
    useEffect(()=>{
        async function initialize () {
            const items = await getItemsAPI();
            setItemsList(items['res']);
            if(state){
                const form = new FormData()
                form.append('package_id', state['id'])
                load(form)
            }
        }
        initialize();
    }, [state])
    useEffect(()=>{
        const delay = setTimeout( async ()=>{
            const form = new FormData()
            form.append('package_name', name)
            load(form)
        }, 500)
        return ()=>clearTimeout(delay)
    }, [name])
    useEffect(()=>{
        let itemsString = ''
        Object.keys(packageItems).map(itemname => {
            itemsString === ''?
            itemsString = itemname + ' - ' + packageItems[itemname]:
            itemsString = itemsString + ', ' + itemname + ' - ' + packageItems[itemname]
            return ''
        })
        updateNewPackage(oldPackage => ({...oldPackage, 'items':itemsString}))
        return undefined
    }, [packageItems, setPackageItems])

    const updatePackage = async (event) => {
        if(event.target.name === 'image'){
            if(event.target.files[0]){
                updateNewPackage(
                    {...newpackage, 
                        [event.target.name]:event.target.value, 
                        'imagedata':URL.createObjectURL(event.target.files[0]),
                        'imagefile':event.target.files[0],
                        'preview':true
                    })
            }
            else{
                updateNewPackage(
                    {...newpackage, 
                        [event.target.name]:'', 
                        'imagedata':'',
                        'imagefile':'',
                        'preview':true
                    })
            }
        }
        else if(event.target.name === 'name'){
            updateNewPackage({...newpackage, [event.target.name]:event.target.value})
            setName(event.target.value)
        }
        else{
            updateNewPackage({...newpackage, [event.target.name]:event.target.value})
        }
    }
    async function createPackage(args){
        let resp = null
        if(newpackage['id'] === ''){
            resp = await addPackageAPI(args)
            setSuccessmessage('Package has been created!')
        }
        else{
            resp = await updatePackageAPI(args)
            setSuccessmessage('Package has been updated!')
        }
        if(resp['res']){
            updateNewPackage(initialState)
            setSelectedItem(initial)
            setMessageOpen(true)
        }
        else{
            setError(resp['err']['error'])
        }
    }
    async function deletePackage(id){
        const form = new FormData()
        form.append('package_id', id)
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        const resp = await deletePackageAPI(form)
        setSuccessmessage('Package has been deleted!')
        if(resp['res']){
            updateNewPackage(initialState)
            setMessageOpen(true)
        }
        else{
            setError(resp['err']['error'])
        }
    }
    const createClicked = (event) => {
        event.preventDefault()
        const form = new FormData();
        form.append('package_id', newpackage['id'])
        form.append('name', newpackage['name']);
        form.append('description', newpackage['description']);
        form.append('file', newpackage['imagefile']);
        form.append('start_date', newpackage['activedate']);
        form.append('expire_date', newpackage['expiredate']);
        form.append('price', newpackage['price']);
        form.append('items', newpackage['items']);
        form.append('admin_id', admin.current['id']);
        form.append('api_key', admin.current['api_key']);
        createPackage(form);
    }
    const handleChange = (event) => {
        if (event.target.value === '' || event.target.value < 1 ){
            setSelectedItem({...selectedItem, 'amount':1})
        }
        else{
            setSelectedItem({...selectedItem, 'amount':[event.target.value]})
        }
    }
    const addItemToList = ()=>{
        if (selectedItem['itemname']){
            setPackageItems({...packageItems, [selectedItem['itemname']]:selectedItem['amount']+' '+selectedItem['unit']})
        }
    }
    
    return <div>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> {successmessage}</h2>
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
                    <Link to='/admin/newpackage' className='navbar-item  selected-nav'>New Package</Link>
                    <Link to='/admin/newitem' className='navbar-item'>New Item</Link>
                    <Link to='/admin/newcategory' className='navbar-item'>New Category</Link>
                    <Link to='/admin/newcoupon' className='navbar-item'>New Coupon</Link>
                    <Link to='/admin/adminstration' className='navbar-item'>Adminstration</Link>
                    <Link to='/admin/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        <div className='body'>
            <h2 className='new-package-label'>Create new package</h2>
            <form onSubmit={createClicked}>
                <div className='new-package-form'>
                    <div className='div-form-col from-col-1'>
                        <label className='pac-input-label'>Pacakge Name <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='text' 
                            className='pac-inputfield pac-name' 
                            id='packagename' 
                            name='name'
                            value={newpackage['name']}
                            onChange={(e) => {updatePackage(e)}}
                            required
                        />
                        <br/>
                        <label className='pac-input-label'>Description <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <textarea 
                            type='text' 
                            className='pac-inputfield pac-desc' 
                            id='description' 
                            name='description'
                            value={newpackage['description']}
                            onChange={(e) => {updatePackage(e)}}
                            required
                        />
                        <br/>
                        <label className='pac-input-label'>Image <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='file'
                            className='pac-inputfield image-upload' 
                            id='image' 
                            name='image'
                            value={newpackage['image']}
                            onChange={(e) => {updatePackage(e)}}
                            required
                        />
                        <br/>
                    </div>
                    <div className='div-form-col from-col-2'>
                        <label className='pac-input-label'>Active Date</label>
                        <br/>
                        <input
                            disabled={newpackage['setitems'] === ''?false:true}
                            type='date'
                            className='pac-inputfield pac-active'
                            id='activedate'
                            name='activedate'
                            value={newpackage['activedate']}
                            onChange={(e) => {updatePackage(e)}}
                        />
                        <br/>
                        <label className='pac-input-label'>Expire Date <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            type='date' 
                            className='pac-inputfield pac-expire' 
                            id='expiredate' 
                            name='expiredate'
                            value={newpackage['expiredate']}
                            onChange={(e) => {updatePackage(e)}}
                            required
                        />
                        <br/>
                        <label className='pac-input-label'>Price <FaAsterisk color='#FF6600' size='9'/></label>
                        <br/>
                        <input 
                            disabled={newpackage['setitems'] === ''?false:true}
                            type='number' 
                            className='pac-inputfield pac-price' 
                            id='price' 
                            name='price'
                            value={newpackage['price']}
                            onChange={(e) => {updatePackage(e)}}
                            required
                        />
                        <br/>
                    </div>
                    <div className='div-form-col from-col-3'>
                        <div className='items-input-div'>
                            <div className='item-input-divs'>
                                <label className='pac-input-label'>Items <FaAsterisk color='#FF6600' size='9'/></label>
                                <br/>
                                <select 
                                    disabled={newpackage['setitems'] === ''?false:true}
                                    className='pac-inputfield-item pac-items' 
                                    id='items' 
                                    name='items'
                                    onChange={(e) => {
                                        const val = e.target.value
                                        if(val === ''){
                                            setSelectedItem(initial)
                                        }
                                        else{
                                            const name = JSON.parse(val).name
                                            const unit = JSON.parse(val).unit
                                            setSelectedItem({'itemname':name,'amount':1,'unit':unit})
                                        }
                                    }}
                                >
                                    <option value=''></option>
                                    {
                                        itemsList?
                                        itemsList.map((item, index) => {
                                            return <option key={index} value={JSON.stringify(item)}>{item.name}</option>
                                        }):<></>
                                    }
                                </select>
                            </div>
                            <div className='item-input-divs'>
                                <label className='pac-input-label'>Amount <FaAsterisk color='#FF6600' size='9'/></label>
                                <br/>
                                <input 
                                    type='number' 
                                    className='pac-inputfield-item pac-items amount-field' 
                                    id='items-am'
                                    disabled={selectedItem['itemname']?false:true}
                                    value={selectedItem['itemname']?selectedItem['amount']:''}
                                    onChange={(e)=>{handleChange(e)}}
                                />
                                <span className='unit-span'>{selectedItem['itemname']?selectedItem['unit']:'Unit'}</span>
                            </div>
                            <div className='item-button-div'>
                                <button type='button' className='item-button pac-items' onClick={addItemToList}><FaPlus color='#00D215' size='20'/></button>
                            </div>
                        </div>
                        <div className='pac-items-holder'>
                            {newpackage['setitems'] === ''?
                                packageItems?
                                Object.keys(packageItems).map((itemname, index) => {
                                    return <div key={index} className='item-container'>
                                            <h2 className='item-value'>
                                                {itemname+' - '+packageItems[itemname] + '  '}
                                                <GrClose onClick={() => {
                                                    const copy = packageItems
                                                    delete copy[itemname]
                                                    setPackageItems(({itemname, ...packageItems}) => packageItems)
                                                }} />
                                            </h2>
                                        </div>
                                }):
                                <></>
                                :
                                newpackage['setitems'].map((item, index)=>{
                                    return <div key={index} className='item-container'>
                                        <h2 className='item-value'>{item}</h2>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='preview-pack'>
                    <PackageComp
                        preview={newpackage['preview']}
                        image={newpackage['imagedata']} 
                        title={newpackage['name']===''?'Package Name': newpackage['name']}
                        discription={newpackage['description']===''?'Package description': newpackage['description']}
                        bgcolor='#FDE47F'
                        items={newpackage['items']===''?'Package contents': newpackage['items']}
                        price={newpackage['price']===''?'Package Price': '$ '+parseInt(newpackage['price']).toFixed(2)+' Birr'}
                    />
                </div>
                <h2 className='error-message'>{error}</h2>
                <button className='create-button' type='submit'>{newpackage['id'] === ''?'Create':'Update'}</button>
                {newpackage['id'] === ''?<></>:<button className='delete-button' type='button' onClick={()=>{deletePackage(newpackage['id'])}}>Delete</button>}
                
            </form>
            
        </div>
    </div>
}

export default NewPackage;