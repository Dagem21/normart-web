import '../../Assets/Styles/home.css'
import '../../Assets/Styles/common.css'
import {ReactComponent as Facebook} from '../../Assets/svg/Facebook.svg'
import {ReactComponent as Instagram} from '../../Assets/svg/Instagram.svg'
import {ReactComponent as Twitter} from '../../Assets/svg/Twitter.svg'
import {ReactComponent as Phone} from '../../Assets/svg/Phone.svg'
import {ReactComponent as Place} from '../../Assets/svg/Places.svg'

function Footer(){
    return <footer className='footer col-12'>
        <div className='contact col-6'>
            <ul className='contactul'>
                <li className='contactus'>
                    <p className='footertext'>Contact Us</p>
                </li>
                <li className='contactus'>
                    <ul className='socials'>
                        <li className='social'><Facebook /></li>
                        <li className='social'><Instagram/></li>
                        <li className='social'><Twitter /></li>
                    </ul>
                </li>
                <li className='contactus phone'><Phone/><span className='icontext'>+251987654321</span></li>
                <li className='contactus phone'><Phone/><span className='icontext'>+251912345678</span></li>
            </ul>
        </div>
        <div className='findus col-6'>
            <p className='footertext'>Find Us</p>
            <div className='location'><Place/><span className='icontext'>Open Locations</span></div>
        </div>
    </footer>

}

export default Footer;