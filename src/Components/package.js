import '../Assets/Styles/package.css'
import {ReactComponent as Path} from '../Assets/svg/Path.svg'
import { API_URL } from '../Config/config';
import { addCartPackage } from '../Services/cart_service'

function PackageComp(props){

    const handleAddPackage = (packageid) => {
        addCartPackage(packageid, 1);
        props.cartAdded(true);
    }
    let image = API_URL+'/image?type=package&filename='+props.image
    if (props.preview){
        if(props.image !== ''){
            image = props.image
        }
        else{
            image = API_URL+'/image?filename=placeholder.png'
        }
    }
    return <div style={{backgroundColor: props.bgcolor}} className='main-container'>
        <div className='container'>
            <div className='pac-image-container'>
                <img 
                className='package-image' 
                src={image} 
                alt="Package"/>
            </div>
            <div className='details'>
                <h2 className='discount'>{props.title}</h2>
                <h3 className='discription'>{props.discription}</h3>
                <h3 className='price'>{props.price}</h3>
                <button className='get-button' onClick={()=>{handleAddPackage(props.id)}}>GET NOW</button>
            </div>
        </div>
        <details className='contents-div'>
            <summary className='items-label'>
                Contents
                <Path className='expand-icon'/>
                </summary>
            <h2 className='items-list'>{props.items}</h2>
        </details>
    </div>
}

export default PackageComp;