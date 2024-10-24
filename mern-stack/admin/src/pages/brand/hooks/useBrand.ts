import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { TBrand } from '@/types/brand.type'
import { deleteBrand, getBrands, updateBrand } from '@/apis/brand.api'

export const useGetBrands = (options?: { enable?: boolean }) => {
  const { accessToken } = useAuth()
  const params = useQueryParams()

  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => getBrands(accessToken, params),
    enabled: options?.enable
  })
}

export const useEditBrand = () => {
  const queryClient = useQueryClient()

  const { accessToken } = useAuth()

  const updateBrandMutation = useMutation({
    mutationKey: ['update-brand'],
    mutationFn: (body: TBrand) => updateBrand(body, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      message.success('Update brand successfully!')
    },
    onError: () => {
      message.error('Update brand failed!')
    }
  })

  const handleEditBrand = (body: TBrand) => {
    updateBrandMutation.mutate(body)
  }

  return { handleEditBrand, updateBrandMutation }
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  const { accessToken } = useAuth()

  const deleteBrandMutation = useMutation({
    mutationKey: ['delete-brand'],
    mutationFn: (id: string) => deleteBrand(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      message.success('Delete brand successfully!')
    },
    onError: () => {
      message.error('Delete brand failed!')
    }
  })

  const handleDeleteBrand = (id: string) => {
    deleteBrandMutation.mutate(id)
  }

  return { handleDeleteBrand, deleteBrandMutation }
}
