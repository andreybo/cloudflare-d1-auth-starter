import React from 'react';
import s1 from '../../assets/s1.svg';
import s2 from '../../assets/s2.svg';
const Loading = () => {
  return (
    <div className="w-full py-2 mx-auto fixed top-0 left-0 h-full bg-gray-100 bg-opacity-75 z-[99] flex justify-center items-center">
        <div className='block w-[80px] h-[80px] relative'>
            <img src={s1} id="circle1" className='absolute top-0 left-0 w-full h-full'/>
            <img src={s2} id="circle2" className='absolute top-0 left-0 w-full h-full'/>
        </div> 
    </div>
  );
};

export default Loading;