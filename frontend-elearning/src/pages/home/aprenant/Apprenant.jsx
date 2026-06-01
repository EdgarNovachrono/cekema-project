import React from 'react'
import HeroImg from '../../../assets/african-american-college-student-with-laptop-sunny-day-city-street .png'

const Apprenant = () => {
  return (
    <div className='w-full md:h-screen h-auto bg-gradient-to-tr 
    from-indigo-500/80 via-sky-500/80 to-purple-700/30 
    flex items-end justify-center md:px-16 sm:px-10 px-4 
    md:pt-0 md:pb-0 pt-[10ch] pb-8'>

      <div className="w-full flex items-center justify-between
      md:gap-16 gap-4 md:flex-nowrap flex-wrap md:flex-row flex-col-reverse">

        {/* content */}
        <div className="md:w-[45%] w-full md:space-y-8 space-y-6">
          <div className="space-y-2">
            <p className="text-lg md:text-2xl font-medium text-neutral-600">
              Leader formation en ligne
            </p>

            <h1 className="md:text-[5rem] text-5xl font-bold text-transparent 
            bg-clip-text bg-gradient-to-r from-indigo-500 via-sky-700 to-purple-700 leading-[1]">
              Rejoignez-nous et commencez votre parcours d'apprentissage dès aujourd'hui !
            </h1>
          </div>

          <p className="text-lg font-normal text-neutral-800 md:pr-16">
            Bienvenue dans notre plateforme d'apprentissage !
          </p>
               <div className="w-full flex items-center gap-6">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-300">
                  Commencer
                </button>
                <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition-colors duration-300">
                  En savoir plus
                </button>
               </div>
        </div>

        {/* image */}
        <div className="md:w-[45%] w-full aspect-square flex items-end justify-end">
          <img src={HeroImg} alt="Apprenant" className="w-full h-full object-contain" />
        </div>

      </div>
    </div>
  )
}

export default Apprenant