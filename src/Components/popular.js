import '../Assets/Styles/popular.css'
import { API_URL } from '../Config/config'

function PopularComp(props){
    let image = API_URL+'/image?type=item&filename='+props.image
    if (props.preview){
        if(props.image !== ''){
            image = props.image
        }
        else{
            image = API_URL+'/image?filename=placeholder.png'
        }
    }
    return <div style={{backgroundColor: props.bgcolor}} className='pop-container'>
        <div className='pop-image-container'>
            <img 
                className='popular-image' 
                src={image} 
                alt="Item"
            />
        </div>
        <div className='pop-details'>
            <h2 className='pop-name'>{props.name}</h2>
            <div className='pop-price-div'>
                <h2 className='pop-discount'>{props.discount}</h2>
                <h3 className='pop-price'>{props.price}</h3>
            </div>
        </div>
    </div>
}

export default PopularComp;