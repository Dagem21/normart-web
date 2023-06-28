import { BrowserRouter, Routes, Route} from "react-router-dom"
import Packages from "../Pages/packages"
import Home from "../Pages/home"
import Category from "../Pages/categories"
import Populars from "../Pages/populars"
import Cart from "../Pages/cart"
import Checkout from "../Pages/checkout"
import Myorders from "../Pages/myorders"
import Setting from "../Pages/setting"

import AdminHome from "../Pages/Admin/home"
import Orders from "../Pages/Admin/orders"
import NewPackage from "../Pages/Admin/newpackage"
import NewCategory from "../Pages/Admin/newcategory"
import NewItem from "../Pages/Admin/newitem"
import Adminstration from "../Pages/Admin/administration"
import AdminSetting from "../Pages/Admin/setting"
import Mycoupons from "../Pages/mycoupons"
import NewCoupon from "../Pages/Admin/newcoupon"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/packages' element={<Packages/>} />
                <Route path='/categories' element={<Category/>} />
                <Route path='/populars' element={<Populars/>} />
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/myorders' element={<Myorders/>} />
                <Route path='/mycoupons' element={<Mycoupons/>} />
                <Route path='/setting' element={<Setting/>} />

                <Route path='/admin' element={<AdminHome />} />
                <Route path='/admin/orders' element={<Orders />} />
                <Route path='/admin/newpackage' element={<NewPackage />} />
                <Route path='/admin/newcategory' element={<NewCategory />} />
                <Route path='/admin/newitem' element={<NewItem />} />
                <Route path='/admin/newcoupon' element={<NewCoupon />} />
                <Route path='/admin/adminstration' element={<Adminstration />} />
                <Route path='/admin/setting' element={<AdminSetting />} />
            </Routes>
        </BrowserRouter>
    )
}