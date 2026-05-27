import { useState, useEffect } from 'react';
import Apprenant from './aprenant/Apprenant';
import Stats from '../stats/Stats';
import Category from '../category/Category';
import Programs from './programs/Programs';
const Home = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  return (
    <div className='space-y-16 w-full min-h-screen flex flex-col pb-16'>
      {/* HeroSection  */}
      <Apprenant />
       {/* Stats Section  */}
       <div className="!-mt-16">
        <Stats/>
       </div>
        {/* category Section  */}
        <Category />
       {/* programs section  */}
         <Programs/>
         {/* quick access section  */}
         {/* blog section  */}

    </div>
  )
}

export default Home
