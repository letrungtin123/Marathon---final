import { FloatButton, Layout } from 'antd'
import { Link, Outlet } from 'react-router-dom'

import { CounterProvider } from '@/contexts/counter-context'
import Header from './components/header'
import Sidebar from './components/sidebar'

const RootLayout = () => {
  return (
    <Layout className='!h-screen'>
      <Layout.Sider width='250px' className='!bg-white hidden lg:block'>
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header className='!bg-white !px-8'>
          <Header />
        </Layout.Header>
        <Layout.Content>
          <CounterProvider>
            <Outlet />
            <Link to={`/messagers`}>
              <FloatButton tooltip={<div>Documents</div>} />
            </Link>
          </CounterProvider>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default RootLayout
