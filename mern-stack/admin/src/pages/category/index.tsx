import { createSearchParams, useNavigate } from 'react-router-dom'
import { useDeleteCategory, useEditCategory, useGetCategory } from './hooks/useCategory'

import { ColumnCategory } from './components/columns'
import FormCategory from './components/form'
import Navbar from '@/components/navbar'
import { TCategory } from '@/types/category.type'
import { Table } from 'antd'
import path from '@/configs/path'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'

const CategoryPage = () => {
  const navigate = useNavigate()
  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TCategory>()
  const params = useQueryParams()

  // categories
  const { data, isLoading } = useGetCategory()
  const categories = data?.data

  // update category
  const { handleEditCategory } = useEditCategory()

  // delte category
  const { handleDeleteCategory } = useDeleteCategory()

  const handleToggleStatusCategory = (value: boolean, record: TCategory) => {
    const status = value === true ? 'active' : 'inactive'

    const newCategory: TCategory = {
      // _id: record._id,
      // createdAt: record.createdAt,
      // desc: record.desc,
      // image: record.image,
      // nameCategory: record.nameCategory,
      // products: record.products,
      // updatedAt: record.updatedAt,
      ...record,
      status: status
    }

    handleEditCategory(newCategory)
  }

  const columns = ColumnCategory({
    onDeleteCategory: handleDeleteCategory,
    onOpenModal: onOpenModal,
    onToggleStatusCategory: handleToggleStatusCategory
  })

  const handleSearch = (nameCategory: string) => {
    navigate({
      pathname: path.category,
      search: createSearchParams({
        ...params,
        q: nameCategory
      }).toString()
    })
  }

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        button={{
          title: 'Thêm danh mục sản phẩm',
          size: 'large',
          className: 'bg-[#14532D] text-white border-[#14532D] hover:bg-[#14532D]',
          onClick: () => onOpenModal('add')
        }}
        input={{
          placeholder: 'Tìm kiếm danh mục sản phẩm',
          onSearch: handleSearch
        }}
      />

      <div>
        <Table loading={isLoading} rowKey={(record) => record._id} dataSource={categories} columns={columns} />
      </div>

      <FormCategory currentData={currentModal} onClose={onCloseModal} />
    </div>
  )
}

export default CategoryPage
