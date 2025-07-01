import { FloatButton, Layout } from 'antd'
import { Link, Outlet } from 'react-router-dom'

import { CounterProvider } from '@/contexts/counter-context'
import Header from './components/header'
import Sidebar from './components/sidebar'

const RootLayout = () => {
  return (
    <Layout className='!h-screen'>
      <Layout.Sider
        width={250}
        className='!bg-white hidden lg:block'
        style={{
          height: '100vh', // Chiều cao full viewport
          position: 'fixed', // Cố định sidebar khi scroll page
          left: 0,
          top: 0,
          overflowY: 'auto' // Scroll dọc khi nội dung dài
        }}
      >
        <Sidebar />
      </Layout.Sider>

      {/* Phần còn lại của layout cần có margin-left bằng width sider để tránh bị che */}
      <Layout
        style={{
          marginLeft: 250, // Cách sidebar một khoảng bằng chiều rộng sider
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Layout.Header className='!bg-white !px-8'>
          <Header />
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
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
