import { Button, Modal } from 'antd'
import { ArrowRestoreIcon } from '../icons'
import { DeleteOutlined } from '@ant-design/icons'
import { cn } from '@/utils/cn'
import { useMemo } from 'react'

interface DeleteTableProps<T extends { is_deleted?: boolean }> {
  rowSelections: T[]
  setOpenModalDelete: (value: boolean) => void
  openModalDelete: boolean
  handleDelete: (values: T[] | T, is_deleted?: boolean) => void
  selectionSingle?: T
  text: {
    title: string
    content: string
  }
  type?: 'delete' | 'restore'
}

const DeleteTable = <T extends { is_deleted?: boolean }>({
  handleDelete,
  openModalDelete,
  rowSelections,
  selectionSingle,
  setOpenModalDelete,
  text,
  type
}: DeleteTableProps<T>) => {
  const checkStatus = useMemo(() => rowSelections.every((item) => item.is_deleted), [rowSelections])

  return (
    <>
      {rowSelections.length > 0 && (
        <div className={cn('flex items-center justify-between')}>
          <button
            className='flex items-center gap-2 text-red-500'
            onClick={() => {
              setOpenModalDelete(true)
            }}
          >
            {!checkStatus && type === 'delete' ? (
              <>
                <DeleteOutlined />
                Delete
              </>
            ) : (
              <>
                <ArrowRestoreIcon />
                Restore
              </>
            )}
          </button>

          <span className=''>{rowSelections.length} Selected</span>
        </div>
      )}

      <Modal
        open={openModalDelete}
        title={<p className='w-full text-2xl font-semibold text-center'>{text.title}</p>}
        onOk={() => setOpenModalDelete(false)}
        closable={false}
        onCancel={() => setOpenModalDelete(false)}
        footer={
          <div className='flex items-center justify-center gap-10 mt-10'>
            <Button danger size='large' className='w-full max-w-[140px]' onClick={() => setOpenModalDelete(false)}>
              Huỷ
            </Button>
            <Button
              type='primary'
              size='large'
              className='w-full max-w-[140px]'
              onClick={() => {
                setOpenModalDelete(false)

                if (rowSelections.length > 1 && checkStatus) {
                  // Restore multiple deleted products
                  handleDelete(rowSelections, false)
                } else if (selectionSingle && selectionSingle.is_deleted) {
                  // Hard delete a single deleted product
                  handleDelete(selectionSingle, true)
                } else {
                  // Soft delete or restore a single product based on current `is_deleted` status
                  handleDelete(selectionSingle || rowSelections[0], !selectionSingle?.is_deleted)
                }
              }}
            >
              {text.title}
            </Button>
          </div>
        }
      >
        <p className='text-center text-gray-500'>{text.content}</p>
      </Modal>
    </>
  )
}

export default DeleteTable
