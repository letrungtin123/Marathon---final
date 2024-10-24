import BgRightImage from '@/assets/images/right.svg'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='grid h-screen grid-cols-1 lg:grid-cols-2'>
      <div className='w-full h-full flex items-center justify-center xl:px-[140px] lg:px-[40px] px-5 xl:py-[90px] py-0'>
        <Outlet />
      </div>
      <div
        className='flex-col items-center justify-center hidden w-full h-full lg:flex'
        style={{
          background: 'linear-gradient(180deg, #4F46E5 0%, #8C48E3 100%)'
        }}
      >
        <img src={BgRightImage} alt='bg-right' className='object-cover w-full h-screen' />
      </div>
    </div>
  )
}

export default AuthLayout
