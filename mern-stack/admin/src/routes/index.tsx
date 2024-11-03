import AuthLayout from '@/layouts/auth-layout'
import CategoryPage from '@/pages/category'
import HomePage from '@/pages'
import IconPage from '@/pages/icons'
import LoginPage from '@/pages/(authen)/login'
import Messagers from '@/pages/messagers'
import OrderPage from '@/pages/orders'
import ProductDetail from '@/pages/products/[productId]'
import ProductPage from '@/pages/products'
import RootLayout from '@/layouts'
import { createBrowserRouter } from 'react-router-dom'
import path from '@/configs/path'
import BrandPage from '@/pages/brand'
import VoucherPage from '@/pages/voucher'

const routes = createBrowserRouter([
  {
    path: path.icons,
    element: <IconPage />
  },
  {
    path: path.home,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: path.products, element: <ProductPage /> },
      { path: path.orders, element: <OrderPage /> },
      { path: path.productDetail, element: <ProductDetail /> },
      { path: path.category, element: <CategoryPage /> },
      { path: path.brand, element: <BrandPage /> },
      { path: path.messagers, element: <Messagers /> },
      { path: path.voucher, element: <VoucherPage /> }
    ]
  },
  {
    path: path.auth,
    element: <AuthLayout />,
    children: [{ path: path.login, element: <LoginPage /> }]
  }
])

export default routes
