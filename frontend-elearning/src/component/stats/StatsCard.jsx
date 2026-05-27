import React from 'react'

const StatsCard = ({icon:Icon,bgColor,borderColor,count,iconColor,description}) => {
  return (
    <div className={`w-full md:px-6 md:py-6 px-3 py-4 border rounded-xl ${bgColor} ${borderColor}`}>
      <div className="flex items-center md:justify-start justify-center gap-4 md:flex-nowrap flex-wrap">
        <div className={`w-14 h-14 ${bgColor} border ${borderColor} 
       rounded-xl flex items-center justify-center`}>
           <span className={`text-3xl font-bold ${iconColor}`}>
            <Icon/>
            </span> 
        </div>
           <div className="flex items-center flex-col md:items-start space-y-0.5 md:text-start text-center">
           
            <h3 className='text-2xl font-bold text-neutral-700 m:text-start text-center'>
                {count}
                </h3>
            <p className='text-sm text-neutral-500'>{description}</p>
           </div>
      </div>
    </div>
  )
}

export default StatsCard
