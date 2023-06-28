import '../Assets/Styles/category.css'
import { API_URL } from '../Config/config';

function CategoryComp(props){
    const image = API_URL+'/image?type=category&filename='+props.image
    return <div className='cat-container'>
        <div style={{backgroundColor: props.bgcolor}} className='cat-image-container'>
            <img 
                className='category-image' 
                src={image} 
                alt="Category"/>
        </div>
        <h2 className='name'>{props.name}</h2>
    </div>
}

export default CategoryComp;