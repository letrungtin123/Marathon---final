import { createSearchParams, useNavigate } from 'react-router-dom'

import Navbar from '@/components/navbar'

import { Table } from 'antd'
import path from '@/configs/path'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'
import { TVoucher } from '@/types/voucher.type'
import { useEditVoucher, useGetVoucher } from './hooks/useVoucher'
import { ColumnVoucher } from './components/columns'
import FormVoucher from './components/form'

const VoucherPage = () => {
  const navigate = useNavigate()
  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TVoucher>()
  const params = useQueryParams()

  const { data, isLoading } = useGetVoucher()
  const vouchers = data?.data

  // update Voucher
  const { handleEditVoucher } = useEditVoucher()

  const handleToggleStatusVoucher = (value: boolean, record: TVoucher) => {
    const status = value === true ? 'active' : 'inactive'

    const newVoucher: TVoucher = { ...record, status: status }

    handleEditVoucher(newVoucher)
  }

  const columns = ColumnVoucher({
    onOpenModal: onOpenModal,
    onToggleStatusVoucher: handleToggleStatusVoucher
  })

  const handleSearch = (code: string) => {
    navigate({
      pathname: path.voucher,
      search: createSearchParams({
        ...params,
        q: code
      }).toString()
    })
  }

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        button={{
          title: 'Thêm khuyến mãi sản phẩm',
          size: 'large',
          className: 'bg-[#14532D] text-white border-[#14532D] hover:bg-[#14532D]',
          onClick: () => onOpenModal('add')
        }}
        input={{
          placeholder: 'Tìm kiếm khuyến mãi sản phẩm',
          onSearch: handleSearch
        }}
      />

      <div>
        <Table loading={isLoading} rowKey={(record) => record._id} dataSource={vouchers} columns={columns} />
      </div>

      <FormVoucher currentData={currentModal} onClose={onCloseModal} />
    </div>
  )
}

export default VoucherPage
