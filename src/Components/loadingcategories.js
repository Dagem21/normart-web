import '../Assets/Styles/loading.css'

function LoadingCategory(){
    return <div className="loadinf-container">
        <div>
            <h3 className='labels'>Categories</h3>
            <div className='categories'>
                <div className="category-loading"></div>
                <div className="category-loading"></div>
            </div>
            <h3 className='labels'>Category</h3>
            <div className='populars'>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
            </div>
        </div>
    </div>
}

export default LoadingCategory;