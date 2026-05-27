import React from 'react'
import StatsCard from '../../component/stats/StatsCard'
import  statsData  from '../../constants/statsData'
const Stats = () => {
  return (
    <div className='w-full flex items-center 
    justify-center bg-neutral-100 py-12 md:px-16 sm:px-10 px-4' >
      <div className="w-full grid md:grid-cols-4 grid-cols-2 md:gap-10 gap-5">
        {/* creations des premiers cards statistiques */}
        {statsData.map((stats,index) => (
          <StatsCard key={index} {...stats}/>
        ))}
      </div>
    </div>
  )
}

export default Stats
