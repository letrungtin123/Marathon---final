import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { TVoucher } from '@/types/voucher.type'
import { getVoucher, updateVoucher } from '@/apis/voucher.api'

export const useGetVoucher = (options?: { enable?: boolean }) => {
  const params = useQueryParams()
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => getVoucher(accessToken, params),
    enabled: options?.enable
  })
}

export const useEditVoucher = () => {
  const queryClient = useQueryClient()

  const { accessToken } = useAuth()

  const updateVoucherMutation = useMutation({
    mutationKey: ['update-voucher'],
    mutationFn: (body: TVoucher) => updateVoucher(body, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      message.success('Update Voucher successfully!')
    },
    onError: () => {
      message.error('Update Voucher failed!')
    }
  })

  const handleEditVoucher = (body: TVoucher) => {
    updateVoucherMutation.mutate(body)
  }

  return { handleEditVoucher, updateVoucherMutation }
}
