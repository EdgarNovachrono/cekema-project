import React from 'react'
import { Link } from 'react-router-dom'
import { FaAngleRight,FaReact} from 'react-icons/fa6'
import CategoryCard from '../../component/category/CategoryCard'
const Category = () => {
  return (
    <div className='w-full md:px-16 sm:px-10 px-4 space-y-8'>
      {/* Top section */}
          <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-800">
                Top Categories
            </h2>
          <div className="flex items-center gap-4">
            <Link to="/category" className="flex items-center gap-4 
            text-sm font-semibold text-neutral-800 hover:text-sky-800 
            cursor-pointer ease-in-out duration-300">
                 View All<FaAngleRight  /> 
            </Link>
          </div>
         </div> 

      {/* category section */}
      <div className="w-full grid md:grid-cols-4 grid-cols-1 md:gap-10 gap-5">
        {/* les premiers cards */}
        <CategoryCard
         icon={<FaReact />}
         gradientFrom={'from-indigo-500'}
         gradientVia={'via-sky-700 via-20%'}
         gradientTo={'to-purple-700 '}
         title={'Web Development'}
         description={'Learn the fundamentals of web development with HTML, CSS, and JavaScript.'}
        />
        <CategoryCard
         icon={<FaReact />}
         gradientFrom={'from-indigo-500'}
         gradientVia={'via-sky-700 via-20%'}
         gradientTo={'to-purple-700 '}
         title={'Web Development'}
         description={'Learn the fundamentals of web development with HTML, CSS, and JavaScript.'}
        />
      </div>
    </div>

  )
}

export default Category 
