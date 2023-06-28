import '../Assets/Styles/loading.css'

function Loading(){
    return <div className="loadinf-container">
        <div>
            <h3 className='labels'>Packages</h3>
            <div className='packages'>
                <div className="package-loading"></div>
                <div className="package-loading"></div>
                <div className="package-loading"></div>
            </div>
            <h3 className='labels'>Categories</h3>
            <div className='categories'>
                <div className="category-loading"></div>
                <div className="category-loading"></div>
            </div>
            <h3 className='labels'>Popular</h3>
            <div className='populars'>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
                <div className="popular-loading"></div>
            </div>
        </div>
    </div>
}

export default Loading;