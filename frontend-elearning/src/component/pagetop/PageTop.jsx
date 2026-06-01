import React,{useEffect} from 'react'
import Breadcrumb from "./../breadcrumb/Breadcrumb";

const PageTop = ({pageTitle}) => {
    useEffect(() => {
        
        window.scrollTo(0,0);
    }, []);
  return (
    <div className='w-full bg-[url("/src/assets/page-top-bg.png")]
      bg-no-repeat bg-cover bg-left md:aspect-[16/4] aspect-auto 
    flex justify-center flex-col md:pt-16
    pt-28 md:pb-0 md:px-16 sm:px-10 px-4 relative '>
      {/* overlay */}
      <div className="absolute w-full h-full top-0 left-0
      bg-gradient-to-b from-zinc-50 via-zinc-100/40 to-zinc-950/60
      opacity-50 z-10">

      </div>
      {/* page top content */}
        <div className="space-y-3 z-20 relative py-3">
            <h1 className="text-4xl font-bold text-zinc-50">
                {pageTitle}
            </h1>
            {/* Breadcrumb */}
               <Breadcrumb/>
        </div>
    </div>
  )
}

export default PageTop
