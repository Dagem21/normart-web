import '../Assets/Styles/common.css'
import '../Assets/Styles/cart.css'
import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useRef, useState } from 'react';
import { addCartItem, addCartPackage, clearCartItem, clearCartPackage, getcartItems, getcartPackages } from '../Services/cart_service';
import { getItemsAPI } from '../Services/item_service';
import { getPackagesAPI } from '../Services/package_service';
import { BiLogOut } from 'react-icons/bi';
import { checkUserLogin } from '../Utils/log';

function Cart(){
    const navigate = useNavigate()
    const user = useRef()
    user.current = checkUserLogin()
    useEffect(()=>{
        if(!user.current){
            navigate('/', { replace:true})
        }
    }, [navigate])

    const logout = () => {
        localStorage.clear();
        navigate('/')
    }
    const [itemToAmount, setItemToAmount] = useState({})
    const [packageToAmount, setPackageToAmount] = useState([])
    useEffect(()=>{
        setItemToAmount({})
        setPackageToAmount([])
        async function initialize () {
            const itemsincart = getcartItems();
            if(Object.keys(itemsincart).length>0){
                const keys = Object.keys(itemsincart);
                const form = new FormData()
                form.append('id_list', keys)
                const res = await getItemsAPI(form)
                const items = res['res']
                setItemToAmount(prevstate => {
                    prevstate = prevstate === undefined? {}:prevstate
                    
                    items.forEach(item => {
                        const categoryname = item['category1']
                        const itemwithamount = item
                        itemwithamount['amount'] = itemsincart[item.id]
                        if ([categoryname] in prevstate){
                            const category = prevstate[[categoryname]]
                            const newstate = {...prevstate}
                            newstate[[categoryname]] = [...category, itemwithamount]
                            prevstate = newstate
                        }
                        else{
                            const newstate = {...prevstate}
                            newstate[[categoryname]] = [itemwithamount]
                            prevstate = newstate
                        }
                    })
                    return prevstate
                });
            }

            const packagesincart = getcartPackages();
            if (Object.keys(packagesincart).length>0){
                const pack_keys = Object.keys(packagesincart);
                const pack_form = new FormData()
                pack_form.append('id_list', pack_keys)
                const res = await getPackagesAPI(pack_form)
                const packages = res['res']
                setPackageToAmount(prevstate => {
                    packages.forEach(pack => {
                        const packagewithamount = pack
                        packagewithamount['amount'] = packagesincart[pack.id]
                        let newstate = []
                        if (prevstate.length === 0){
                            newstate = [packagewithamount]
                        }
                        else{
                            newstate = prevstate
                            newstate = [packagewithamount]
                        }
                        prevstate = newstate
                    })
                    return prevstate
                });
            }
        }
        initialize();
    }, [])
    const handleAmountAdd = (category, index) => {
        if (category === 'Packages'){
            let newstate = packageToAmount
            newstate[index]['amount'] = newstate[index]['amount'] + 1
            console.log( newstate[index]['amount'])
            setPackageToAmount([...newstate])
        }
        else{
            let newstate = itemToAmount
            newstate[category][index]['amount'] = newstate[category][index]['amount'] + 1
            setItemToAmount({...newstate})
        }
    }
    const handleAmountMinus = (category, index) => {
        if (category === 'Packages'){
            let newstate = packageToAmount
            if(newstate[index]['amount'] > 1) {
                newstate[index]['amount'] = newstate[index]['amount'] - 1
                setPackageToAmount([...newstate])
            }
        }
        else{
            let newstate = itemToAmount
            if(newstate[category][index]['amount'] > 1) {
                newstate[category][index]['amount'] = newstate[category][index]['amount'] - 1
                setItemToAmount({...newstate})
            }
        }
    }
    const handleChange = (event, category, index) => {
        if(category === 'Packages'){
            let newstate = packageToAmount
            if (event.target.value === '' || event.target.value < 1 ){
                newstate[index]['amount'] = 1
                setPackageToAmount([...newstate])
            }
            else{
                newstate[index]['amount'] = parseInt(event.target.value)
                setPackageToAmount([...newstate])
            }
        }
        else{
            let newstate = itemToAmount
            if (event.target.value === '' || event.target.value < 1 ){
                newstate[category][index]['amount'] = 1
                setItemToAmount({...newstate})
            }
            else{
                newstate[category][index]['amount'] = parseInt(event.target.value)
                setItemToAmount({...newstate})
            }
        }
    }
    const deleteitem = (category, index)=>{
        setItemToAmount(prev => {
            const upitems = prev
            upitems[category] = upitems[category].filter((_, i) => i !== index)
            if(Object.keys(upitems[category]).length === 0){
                delete upitems[category]
            }
            clearCartItem()
            Object.values(upitems).map(itemlist => itemlist.map(item => addCartItem(item['id'], item['amount'])))
            return {...upitems}
        })
    }
    const deletepack = (index)=>{
        setPackageToAmount(prev => {
            const newpacks = prev.filter((_, i) => i !== index)
            clearCartPackage()
            newpacks.map(pack => addCartPackage(pack['id'], pack['amount']))
            return newpacks
        })
    }
    const tocheckout = () => {
        Object.values(itemToAmount).map(itemlist => itemlist.map(item => addCartItem(item['id'], item['amount'])))
        packageToAmount.map(pack => addCartPackage(pack['id'], pack['amount']))
        navigate('/checkout')
    }
    var total = 0
    Object.values(itemToAmount).map(itemlist => itemlist.map(item => total+=(parseInt(item['amount'])*parseFloat(item['price']))))
    packageToAmount.map(pack => total+=(parseInt(pack['amount'])*parseFloat(pack['price'])))
    
    return <div className="cart-container">
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
                    <Link to='/populars' className='navbar-item'>Popular</Link>
                    <Link to='/cart' className='navbar-item selected-nav'>Cart</Link>
                    <Link to='/myorders' className='navbar-item'>My Orders</Link>
                    <Link to='/mycoupons' className='navbar-item'>My Coupons</Link>
                    <Link to='/setting' className='navbar-item'>Setting</Link>
                    <div className='navbar-item' onClick={logout}><BiLogOut size='20'/></div>
                </ul>
            </div>
        </div>
        {Object.keys(itemToAmount).length === 0 && packageToAmount.length === 0?
            <h2 className='empty-cart'>Your cart is empty! Add some products to your cart.</h2>:
            <div className='cart-table-container'>
                <table>
                    <tbody>
                        {Object.keys(itemToAmount).length>0?
                            Object.keys(itemToAmount).map((category, index) => {
                                const items = itemToAmount[[category]].map((item, index) => {
                                    return <td key={index} className='tablerow-item rcol2'>
                                        
                                        <h2 className='item-name'>{item['name']}<AiOutlineDelete className='delete-icon' onClick={()=>{deleteitem(category, index)}}/></h2>
                                        <div className='cart-input-container'>
                                            <FaMinus 
                                                className='icon-amount minus' 
                                                onClick={() => handleAmountMinus(category, index)}
                                            />
                                            <input 
                                                name={item['name']}
                                                type="number" 
                                                id='amount' 
                                                className="amount-input" 
                                                value={item['amount']} 
                                                onChange={(event) => handleChange(event, category, index)}
                                            />
                                            <FaPlus 
                                                className='icon-amount plus' 
                                                onClick={() => handleAmountAdd(category, index)}
                                            />
                                        </div>
                                        <h2 className='item-total-price'>Total :</h2>
                                        <h2 className='item-total-price-value'>{item['amount']} x {item['price']} = {(parseFloat(item['price'])*parseInt(item['amount'])).toFixed(2)} Birr</h2>
                                    </td>
                                });
                                return <tr key={index} className='tablerow'>
                                <td className='tablerow-cat rcol1'>{category}</td>
                                {items}
                                </tr>
                            }):
                            <></>
                        }
                        {packageToAmount.length>0?
                            <tr className='tablerow'>
                                <td className='tablerow-cat rcol1'>Packages</td>
                                {packageToAmount.map((pack, index) => {
                                    return <td key={index} className='tablerow-item rcol2'>
                                        <h2 className='item-name'>{pack['name']}<AiOutlineDelete className='delete-icon' onClick={()=>{deletepack(index)}}/></h2>
                                        <div className='cart-input-container'>
                                        <FaMinus 
                                            className='icon-amount minus' 
                                            onClick={() => handleAmountMinus('Packages', index)}
                                        />
                                        <input 
                                            name={pack['name']}
                                            type="number" 
                                            id='amount' 
                                            className="amount-input" 
                                            value={pack['amount']} 
                                            onChange={(event) => handleChange(event, 'Packages', index)}
                                        />
                                        <FaPlus 
                                            className='icon-amount plus' 
                                            onClick={() => handleAmountAdd('Packages', index)}
                                        />
                                    </div>
                                    <h2 className='item-total-price'>Total :</h2>
                                    <h2 className='item-total-price'>{pack['amount']} x {pack['price']} = {(parseFloat(pack['price'])*parseInt(pack['amount'])).toFixed(2)} Birr</h2>
                                    </td>
                                })}
                            </tr>
                            :
                            <></>
                        }
                    </tbody>
                </table>
                <div className='total-checkout'>
                    <h2 className='item-total-price'>Total : <span className='price-span'>$ 
                    {
                        total.toFixed(2)
                    }
                    </span> Birr</h2>
                    <button className='to-checkout-button' onClick={tocheckout}>CHECKOUT</button>
                </div>
            </div>
        }
    </div>
}

export default Cart;