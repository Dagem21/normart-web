import '../Assets/Styles/itempopup.css'
import { FaMinus, FaPlus } from "react-icons/fa";
import { useState } from 'react';
import { addCartItem } from '../Services/cart_service';
import { API_URL } from '../Config/config';

function Itempopup(props){
    const [amount, setAmount] = useState(1)
    const handleAmountAdd = () => {
        setAmount(amount+1)
    }
    const handleAmountMinus = () => {
        if(amount > 1) {setAmount(amount-1)}
    }
    const handleChange = (event) => {
        if (event.target.value === '' || event.target.value < 1 ){
            setAmount(1)
        }
        else{
            setAmount(parseInt(event.target.value))
        }
    }

    const handleAddItem = (itemid) => {
        addCartItem(itemid, amount);
        props.cartAdded(true)
    }
    const image = API_URL + '/image?type=item&filename='+props.image

    return <div className="popup-container">
        <div className='image-div'>
            <div style={{backgroundColor: props.bgcolor}} className='item-image-container'>
                <img className='item-image' src={image}  alt="Nor Mart"/>
            </div>
        </div>
        <div className='item-details'>
            <h2 className="item-name">{props.name}</h2>
            <h2 className="item-discount">{props.discount}</h2>
            <h2 className="item-price">{props.price}</h2>
            <div className='input-container'>
                <FaMinus 
                    className='icon-amount minus' 
                    onClick={() => handleAmountMinus()}
                />
                <input 
                    type="number" 
                    id='amount' 
                    className="amount-input" 
                    value={amount} 
                    onChange={(event) => handleChange(event)}
                />
                <FaPlus 
                    className='icon-amount plus' 
                    onClick={() => handleAmountAdd()}
                />
                <br/>
                <button className="addcart-popup" onClick={()=>{handleAddItem(props.itemId)}}>Add Cart</button>
            </div>
            
        </div>
    </div>
}

export default Itempopup;