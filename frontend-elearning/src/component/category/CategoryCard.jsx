import React from 'react'

const CategoryCard = ({ icon, gradientFrom, gradientVia, gradientTo, title, description }) => {
  return (
    <div className={`w-full max-w-sm flex flex-col items-center justify-center gap-6 rounded-xl bg-gradient-to-tr hover:bg-gradient-to-tl
      ${gradientFrom} ${gradientVia} ${gradientTo} 
      px-6 py-8 transition-all ease-in-out duration-300 cursor-pointer
      hover:scale-[1.02] hover:brightness-110 shadow-sm hover:shadow-lg`}>
      
      {/* Conteneur de l'icône (réduit à w-16 h-16) */}
      <div className="w-16 h-16 flex items-center justify-center 
        rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-700 via-20% to-purple-700 shadow-inner">
        <span className='text-3xl font-bold text-neutral-50'>
          {icon}
        </span> 
      </div>

      {/* Conteneur du texte (gap plus petit) */}
      <div className="space-y-2 w-full text-center">
        <h3 className='text-xl font-semibold text-neutral-800'>{title}</h3>
        <p className='text-sm text-neutral-700 line-clamp-3'>
          {description}
        </p>
      </div>
    </div>
  )
}

export default CategoryCard