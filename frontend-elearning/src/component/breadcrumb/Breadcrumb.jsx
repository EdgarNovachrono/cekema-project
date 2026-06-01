import React from 'react'
import { useLocation,Link } from "react-router-dom";


const Breadcrumb = () => {
    const location = useLocation();
    const pathname= location.pathname.split('/').filter(x=>x)
    //dynamic
    const breadcrumbpaths=[
        {name:"Home",link:"/"},
        ...pathname.map((segment,index)=>({
            name:segment.charAt(0).toUpperCase() + segment.slice(1),
            link:`/${pathname.slice(0,index + 1).join('/')}`
        })
    )
    ]
  return (
    <div className='w-fit flex items-center gap-x-2'>
       { breadcrumbpaths.map((path,index)=>{
        const isLast= index === breadcrumbpaths.length-1;
        return(
            <React.Fragment key={index}>
                {isLast?(
                    <p className="md:text-base
                     text-sm font-normal text-zinc-400">
                        {pathname}
                    </p>
                ):(
                    <>
                    <Link to={path.link} className="md:text-base
                     text-sm font-normal text-zinc-300
                     hover:text-zinc-100">
                        {path.name}
                     </Link>
                     {/* seperator */}
                     <span className="md:text-base
                     text-sm font-normal text-zinc-200 ml-2">/</span>
                    </>
                    
                )}
            </React.Fragment>
        )
       }

       )

       }
    </div>
  )
}

export default Breadcrumb
