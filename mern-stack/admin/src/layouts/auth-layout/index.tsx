import login from '@/assets/images/login.png.png'
// import NewBackgroundImage from '@/assets/images/newImage.jpg'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='grid h-screen grid-cols-1 lg:grid-cols-2'>
      <div className='w-full h-full flex items-center justify-center xl:px-[140px] lg:px-[40px] px-5 xl:py-[90px] py-0'>
        <Outlet />
      </div>
      <div
        className='flex-col items-center justify-center w-full h-full lg:flex'
        style={{
          backgroundImage: `url(${login})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  )
}
export default AuthLayout
