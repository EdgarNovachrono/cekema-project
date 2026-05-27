import React from 'react'
import { FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import   ProgramsCard from '../../../component/programs/ProgramsCard'
import  programsData  from '../../../constants/programsData'

const Programs = () => {
  return (
    <div className='w-full md:px-16 sm:px-10 px-4 space-y-8'>
       {/* Top section */}
          <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-800">
                formations populaires
            </h2>
          <div className="flex items-center gap-4">
            <Link to="/category" className="flex items-center gap-4 
            text-sm font-semibold text-neutral-800 hover:text-sky-800 
            cursor-pointer ease-in-out duration-300">
                 View All<FaAngleRight  /> 
            </Link>
          </div>
         </div> 
  {/* fomation section */}
      <div className="w-full grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-5">
        {/* les premiers cards */}
         {programsData.map((programs,index) => (
          <ProgramsCard key={index} {...programs}/>
        ))}
      </div>
    </div>
  )
}

export default Programs
