import { TModalType, TQueryParams } from '@/types/common.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, notification } from 'antd'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { softDeleteMultipleProduct } from '@/apis/product.api'
import DeleteTable from '@/components/delete-table'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'
import { TProduct } from '@/types/product.type'
import { useState } from 'react'
import FomrProduct from './form/form-product'
import ColumnsTable from './table/columns-table'

interface MainProductProps {
  products: TProduct[]
  totalDocs: number
  isLoading?: boolean
  getData?: (type: TModalType, data?: TProduct) => void
}

const MainProduct = ({ products, isLoading, getData, totalDocs }: MainProductProps) => {
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const queryParams: TQueryParams = useQueryParams()
  const { _limit, _page } = queryParams

  const { accessToken } = useAuth()

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [rowSelections, setRowSelections] = useState<TProduct[]>([])
  const [product, setProduct] = useState<TProduct>()
  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TProduct>()

  const deleteMultipleMutation = useMutation({
    mutationKey: ['deleteMultipleProduct'],
    mutationFn: (params: { id: string | string[]; is_deleted?: boolean }) =>
      softDeleteMultipleProduct(params, accessToken),
    onSuccess: (data) => {
      const isCheckRestore = data.message === 'Restore product success!'
      notification.success({
        message: `${isCheckRestore ? 'Khôi phục' : 'Xoá'} sản phẩm thành công`,
        description: `Sản phẩm đã được ${isCheckRestore ? 'khôi phục thành công' : 'xoá vào thùng rác'}`
      })
      queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
    },
    onError: () => {
      notification.error({
        message: 'Thao tác thất bại!',
        description: 'Có lỗi xảy ra khi xử lý sản phẩm'
      })
    }
  })

  const handleDelete = (values: TProduct[] | TProduct, is_deleted?: boolean) => {
    if (Array.isArray(values)) {
      const ids = values.map((item) => item._id)
      deleteMultipleMutation.mutate({ id: ids, is_deleted })
    } else {
      deleteMultipleMutation.mutate({ id: values._id, is_deleted })
    }
  }

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: TProduct[]) => {
      setRowSelections(selectedRows)
    }
  }

  const columns = ColumnsTable({
    onDelete: handleDelete,
    setOpenModalDelete,
    onDetail: setProduct,
    rowSelections,
    getData,
    onOpenModal
  })

  return (
    <div className=''>
      <Table
        loading={isLoading}
        rowKey={(record) => record._id}
        dataSource={products}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        columns={columns}
        pagination={{
          current: Number(_page) || 1,
          pageSize: Number(_limit) || 8,
          total: totalDocs,
          onChange: (page, pageSize) => {
            navigate({
              pathname: '/products',
              search: createSearchParams({
                _page: page.toString(),
                _limit: pageSize.toString()
              }).toString()
            })
          },
          showTotal(total, range) {
            return (
              <div className='flex items-center justify-between w-full mr-auto text-black-second'>
                Showing {range[0]}-{range[1]} of {total}
              </div>
            )
          }
        }}
      />

      <FomrProduct currentData={currentModal} onClose={onCloseModal} />

      <DeleteTable
        handleDelete={(values, is_deleted) => handleDelete(values, is_deleted)}
        openModalDelete={openModalDelete}
        rowSelections={rowSelections}
        setOpenModalDelete={setOpenModalDelete}
        selectionSingle={product}
        text={{
          title: 'Xoá sản phẩm',
          content: 'Bạn có chắc chắn muốn xoá sản phẩm này không? Hành động này không thể hoàn tác?'
        }}
        type={queryParams?.deleted === 'true' ? 'restore' : 'delete'}
      />
    </div>
  )
}

export default MainProduct
