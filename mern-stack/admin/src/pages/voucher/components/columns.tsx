import { EditOutlined } from '@ant-design/icons'
import { Switch, TableColumnsType, Tag, Tooltip } from 'antd'
import { TModalType } from '@/types/common.type'
import { TVoucher } from '@/types/voucher.type'
import dayjs from 'dayjs'

interface ColumnVoucherProps {
  onOpenModal: (type: TModalType, data?: TVoucher) => void
  onToggleStatusVoucher: (value: boolean, record: TVoucher) => void
}

export const ColumnVoucher = ({ onToggleStatusVoucher, onOpenModal }: ColumnVoucherProps) => {
  const columns: TableColumnsType<TVoucher> = [
    {
      title: 'Mã khuyến mãi',
      dataIndex: 'code',
      key: 'code',
      render: (_: string, record: TVoucher) => {
        const code = record
        return code?.code
      }
    },
    {
      title: 'Giá trị khuyến mãi',
      dataIndex: 'voucherPrice',
      key: 'voucherPrice',
      render: (_: string, record: TVoucher) => {
        const voucherPrice = record?.voucherPrice
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucherPrice)
      }
    },
    {
      title: 'Áp dụng cho đơn hàng',
      dataIndex: 'applicablePrice',
      key: 'applicablePrice',
      render: (_: string, record: TVoucher) => {
        const applicablePrice = record?.applicablePrice
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(applicablePrice)
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'discount',
      key: 'discount',
      render: (_: string, record: TVoucher) => {
        const discount = record
        return discount?.discount
      }
    },
    {
      title: 'Ngày hiệu lực',
      dataIndex: 'Ngày hiệu lực',
      key: 'Ngày hiệu lực',
      render: (_: string, record: TVoucher) => {
        const startDate = record
        return dayjs(startDate?.startDate).format('DD/MM/YYYY')
      }
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'Ngày hết hạn',
      key: 'Ngày hết hạn',
      render: (_: string, record: TVoucher) => {
        const endDate = record
        return dayjs(endDate?.endDate).format('DD/MM/YYYY')
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const isActive = status === 'active'
        return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      }
    },
    {
      title: 'Thay đổi trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_: unknown, record: TVoucher) => {
        const isActive = record.status === 'active'
        return <Switch checked={isActive} onChange={(value) => onToggleStatusVoucher(value, record)} />
      }
    },
    {
      title: null,
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: TVoucher) => {
        return (
          <>
            <Tooltip title={'Cập nhật khuyến mãi sản phẩm'}>
              <button
                className='h-8 px-4 border border-gray-400 rounded-r-md  rounded-l-md '
                onClick={() => onOpenModal('edit', record)}
              >
                <EditOutlined height={20} width={20} />
              </button>
            </Tooltip>
          </>
        )
      }
    }
  ]

  return columns
}
