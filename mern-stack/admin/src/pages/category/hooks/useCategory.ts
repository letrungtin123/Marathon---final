import { deleteCategory, getCategories, updateCategory } from '@/apis/category.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { TCategory } from '@/types/category.type'
import { message } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'

export const useGetCategory = (options?: { enable?: boolean }) => {
  const { accessToken } = useAuth()
  const params = useQueryParams()

  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(accessToken, params),
    enabled: options?.enable
  })
}

export const useEditCategory = () => {
  const queryClient = useQueryClient()

  const { accessToken } = useAuth()

  const updateCategoryMutation = useMutation({
    mutationKey: ['update-category'],
    mutationFn: (body: TCategory) => updateCategory(body, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      message.success('Update category successfully!')
    },
    onError: () => {
      message.error('Update category failed!')
    }
  })

  const handleEditCategory = (body: TCategory) => {
    updateCategoryMutation.mutate(body)
  }

  return { handleEditCategory, updateCategoryMutation }
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  const { accessToken } = useAuth()

  const deleteCategoryMutation = useMutation({
    mutationKey: ['delete-category'],
    mutationFn: (id: string) => deleteCategory(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      message.success('Delete category successfully!')
    },
    onError: () => {
      message.error('Delete category failed!')
    }
  })

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id)
  }

  return { handleDeleteCategory, deleteCategoryMutation }
}
