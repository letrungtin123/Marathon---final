import { Outlet } from 'react-router-dom'
// import bgloginadmin from '@/assets/images/LogoProject.png'
import bgadmintest2 from '@/assets/images/bgloginadmintest.webp'

const AuthLayout = () => {
  return (
    <div className='grid h-screen '>
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
