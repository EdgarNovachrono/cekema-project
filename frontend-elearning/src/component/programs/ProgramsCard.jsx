 import React from 'react'

 import { Link } from 'react-router-dom'
    import { FaTag,FaStar,FaUserTie } from 'react-icons/fa6'
    import { IoMdHeartEmpty } from 'react-icons/io'
    import { PiBookOpenTextFill } from 'react-icons/pi'
    import { FiClock } from 'react-icons/fi'
    import { FaAnglesRight } from 'react-icons/fa6'
 const ProgramsCard = ({image,category,rating,title,lessons,students,duration,price}) => {
   return (
     <div className='w-full rounded-xl
      border border-neutral-200 space-y-2 overflow-hidden'>
       <img src={image} alt={title} className="w-full aspect-[16/10] object-cover object-center" />

     <div className="md:p-4 p-3 space-y-5">
                {/* section  category,rating*/}
        <div className="w-full flex items-center justify-between">
                <p className="w-fit text-sm text-sky-800 bg-sky-800/10 rounded-full px-3 py-1 flex
                  items-center gap-x-1.5">
                   <FaTag size={14}  className='text-sky-700'/> 
                  {category}
                </p>
                <div className="flex items-center gap-x-3">
                    <p className="text-sm 
                    text-yellow-500 border 
                    border-yellox-200
                    rounded-full px-3 py-1 flex items-center gap-x-1">
                        <FaStar size={14}  />
                        {rating}
                    </p>
                    <button className="w-8 h-8 flex items-center justify-center cursor-pointer">
                        <IoMdHeartEmpty size={24}  />
                    </button>
                </div>
        </div>
        {/* section Title */}
        <Link to={`/program/detail`} className="text-xl font-semibold
        text-neutral-950 line-clamp-2 text-ellipsis">
          {title}
        </Link>
        {/* lessions,students */}
        <div className="w-full flex items-center justify-between flex-wrap gap-2">
            {/* lessions and students */}
            <div className="flex items-center gap-x-3">
             <p className="text-sm text-neutral-800 font-medium flex items-center gap-x-1 5">
               <PiBookOpenTextFill size={16} className='text-neutral-500'  />
                {lessons} 
                </p>  
                <div className="w-1 h-1 rounded-full bg-neutral-400">

                </div>
             <p className="text-sm text-neutral-800 font-medium flex items-center gap-x-1 5">
               <FaUserTie size={16} className='text-neutral-500'  />
                {students} 
                </p>  


            </div>
            {/* duration */}
            <p className="text-sm text-neutral-800 font-medium flex items-center gap-x-1 5">
               <FiClock size={16} className='text-neutral-500'  />
                {duration} 
                </p>  
        </div>
        {/* seperateur */}
        <div className="w-full h-px bg-neutral-200">
            {/* price and button */}
        </div>
         
         <div className="w-full flex items-center justify-between">
            <p className="text-lg font-semibold text-neutral-800">
                {price}
            </p>
              <Link to={`/program/enroll-programs-title`} className="w-fit text-sky-900
              text-sm font-medium flex items-center justify-center
              gap-2 hover:text-sky-800 transition-all ease-in-out duration-300">
                Enroll Now <FaAnglesRight size={14}  /> 
            </Link>
            <button className="px-4 py-2 rounded-full bg-sky-700 text-white text-sm font-medium hover:bg-sky-800 transition-colors duration-200">
                View Details
            </button>
         </div>
     </div>
     </div>
   )
 }
 
 export default ProgramsCard
 