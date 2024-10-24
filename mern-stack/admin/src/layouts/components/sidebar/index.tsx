import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Menu } from 'antd'
import { cn } from '@/utils/cn'
import { menus } from './menu'

const Sidebar = () => {
  const location = useLocation()
  const pathName = location.pathname

  const [activeSidebar, setActiveSidebar] = useState<number>(1)

  useEffect(() => {
    const menuIndex = menus.findIndex((menu) => menu.link === pathName)
    setActiveSidebar(menuIndex + 1)
  }, [])

  return (
    <div className='h-screen overflow-y-scroll border-r border-r-gray-light scrollbar-hide'>
      <section className='flex items-center justify-center w-full h-header'>
        <p className='text-xl font-extrabold font-nunito-sans'>
          <span className='text-primary'>Dash</span>
          <span className=''>Stack</span>
        </p>
      </section>

      {/* menu */}
      <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode='inline'>
        {menus.map((menu, index) => (
          <Menu.Item
            className='relative !rounded-none !bg-white w-full'
            key={menu.id}
            onClick={() => setActiveSidebar(index + 1)}
          >
            <Link to={menu.link} className='flex items-center justify-center w-full h-full'>
              <div
                className={cn('absolute top-0 bottom-0 left-0 w-1 h-full rounded-r-md', {
                  'bg-primary': activeSidebar === index + 1
                })}
              ></div>
              <div
                className={cn('w-full px-4 rounded-md text-black flex items-center !gap-3 fill-black', {
                  'text-white bg-primary fill-white': activeSidebar === index + 1
                })}
              >
                {menu.icon}
                <span className='!mx-0 text-inherit'>{menu.title}</span>
              </div>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  )
}

export default Sidebar
