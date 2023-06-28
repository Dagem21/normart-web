import PopularComp from './popular'
import '../Assets/Styles/categories.css'
import React from 'react'
import Popup from 'reactjs-popup'
import Itempopup from './itempopup'
import { getItemsAPI } from '../Services/item_service'
import { FaCheckCircle } from 'react-icons/fa'

function SelectedCategory(props) {

    const bgcolors = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
    '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']

    const [popularList, setPopularList] = React.useState([])

    const [modelopen, setModelOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState()
    const [messageopen, setMessageOpen] = React.useState(false)

    React.useEffect(()=>{
        const bgcolors2 = ['#7FC2FD', '#fd7f7f', '#7FC4FD', '#f27ffd', '#cb7ffd', '#967ffd', '#7fb6fd', 
        '#7ff9fd', '#8CFD7F', '#7ffd90', '#8efd7f', '#b1fd7f', '#e6fd7f', '#FDAA7F', '#fdc67f', '#fd7f7f']
        async function initialize () {
            setPopularList([])
            const form = new FormData()
            form.append('category1', props.category)
            const items = await getItemsAPI(form);
            items['res']?
            items['res'].map((item) => {
                const popu = <div key={item.id} onClick={()=>{setModelOpen(true);setSelectedItem(item)}}>
                    <PopularComp
                        itemId={item.id}
                        image={item.image}
                        name={item.name}
                        discount={item.discount !== null? '$ '+ parseFloat(item.price).toFixed(2) +' Birr' : ''}
                        price={item.discount !== null?'$ '+ parseFloat(item.price-((item.price*item.discount)/100)).toFixed(2) +' Birr' : '$ '+ parseFloat(item.price).toFixed(2) +' Birr'}
                        bgcolor={bgcolors2[Math.floor(Math.random() * bgcolors2.length)]}
                    />
                </div>
                setPopularList(prev => [...prev, popu])
                return ''
                }
            ):<></>
        }
        initialize();
    }, [props.category])

    const childReturn = (added) => {
        if(added){
            setModelOpen(false);
            setMessageOpen(true);
        }
    }
    
    return <div className='selected-category'>
        <Popup open={messageopen} onClose={()=>setMessageOpen(false)}>
            <div>
                <h2 className='message-box'><span><FaCheckCircle size='30'/></span> Item has been added to your Cart!</h2>
            </div>
        </Popup>
        <Popup open={modelopen} onClose={()=>setModelOpen(false)}>
            {selectedItem?
                <div>
                    <Itempopup
                        cartAdded = {(stat)=>childReturn(stat)}
                        itemId={selectedItem.id}
                        image={selectedItem.image}
                        name={selectedItem.name}
                        discount={selectedItem.discount !== null? '$ '+ parseFloat(selectedItem.price).toFixed(2) +' Birr' : ''}
                        price={selectedItem.discount !== null?
                            '$ '+ parseFloat((selectedItem.price*selectedItem.discount)/100).toFixed(2) +' Birr / '+selectedItem.unit : 
                            '$ '+ parseFloat(selectedItem.price).toFixed(2) +' Birr / '+selectedItem.unit}
                        bgcolor={bgcolors[Math.floor(Math.random() * bgcolors.length)]}
                    />
                </div>:
                <></>
                }
        </Popup>
        <h3 className='labels'>{props.category}</h3>
        <div className='category-items'>
            {popularList.length>0?
                popularList.map((ele)=>{return ele}):<></>
            }
        </div>
    </div>
}

export default SelectedCategory