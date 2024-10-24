import { createSearchParams, useNavigate } from 'react-router-dom'

import Navbar from '@/components/navbar'
import { Table } from 'antd'
import path from '@/configs/path'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'
import { TBrand } from '@/types/brand.type'
import { useDeleteBrand, useEditBrand, useGetBrands } from './hooks/useBrand'
import FormBrand from './components/form'
import { ColumnBrand } from './components/columns'

const BrandPage = () => {
  const navigate = useNavigate()
  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TBrand>()
  const params = useQueryParams()

  // categories
  const { data, isLoading } = useGetBrands()
  const categories = data?.data

  // update Brand
  const { handleEditBrand } = useEditBrand()

  // delte Brand
  const { handleDeleteBrand } = useDeleteBrand()

  const handleToggleStatusBrand = (value: boolean, record: TBrand) => {
    const status = value === true ? 'active' : 'inactive'

    const newBrand: TBrand = {
      // _id: record._id,
      // createdAt: record.createdAt,
      // desc: record.desc,
      // image: record.image,
      // nameBrand: record.nameBrand,
      // products: record.products,
      // updatedAt: record.updatedAt,
      ...record,
      status: status
    }

    handleEditBrand(newBrand)
  }

  const columns = ColumnBrand({
    onDeleteBrand: handleDeleteBrand,
    onOpenModal: onOpenModal,
    onToggleStatusBrand: handleToggleStatusBrand
  })

  const handleSearch = (nameBrand: string) => {
    navigate({
      pathname: path.brand,
      search: createSearchParams({
        ...params,
        q: nameBrand
      }).toString()
    })
  }

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        button={{
          title: 'Thêm thương hiệu sản phẩm',
          size: 'large',
          type: 'primary',
          onClick: () => onOpenModal('add')
        }}
        input={{
          placeholder: 'Tìm kiếm thương hiệu sản phẩm',
          onSearch: handleSearch
        }}
      />

      <div>
        <Table loading={isLoading} rowKey={(record) => record._id} dataSource={categories} columns={columns} />
      </div>

      <FormBrand currentData={currentModal} onClose={onCloseModal} />
    </div>
  )
}

export default BrandPage
