import { AppstoreOutlined, ShoppingCartOutlined, GiftOutlined, ShoppingOutlined, TagsOutlined } from '@ant-design/icons'
import { DashboardIcon } from '@/components/icons'
import path from '@/configs/path'

export const menus = [
  {
    id: 1,
    title: 'Dashboard',
    icon: <DashboardIcon className='fill-inherit' />,
    link: path.home
  },
  {
    id: 2,
    title: 'Các đơn hàng',
    icon: <ShoppingCartOutlined />,
    link: path.orders
  },
  {
    id: 3,
    title: 'Sản phẩm',
    icon: <ShoppingOutlined />,
    link: path.products
  },
  {
    id: 4,
    title: 'Danh mục sản phẩm',
    icon: <AppstoreOutlined />,
    link: path.category
  },
  {
    id: 5,
    title: 'Thương hiệu',
    icon: <TagsOutlined />,
    link: path.brand
  },
  {
    id: 6,
    title: 'Khuyến mãi',
    icon: <GiftOutlined />,
    link: path.voucher
  }
]
