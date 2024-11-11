import { Outlet } from 'react-router-dom'
import bgloginadmin from '@/assets/images/bg-final.png'
import bgadmintest2 from '@/assets/images/bgloginadmintest.webp'

const AuthLayout = () => {
  return (
    <div className='grid h-screen grid-cols-1 lg:grid-cols-2'>
      {/* Left section with login form */}
      <div
        className='relative hidden lg:flex items-center justify-center w-full h-full'
        style={{
          backgroundImage: `url(${bgloginadmin})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Optional gradient overlay for contrast */}
        <div className='absolute inset-0 bg-gradient-to-br from-green-900 via-transparent to-green-500 opacity-60' />
      </div>

      {/* Right section with background image */}
      <div
        className='flex items-center justify-center w-full h-full xl:px-36 lg:px-10 px-5 xl:py-20 py-10'
        style={{
          backgroundImage: `url(${bgadmintest2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
