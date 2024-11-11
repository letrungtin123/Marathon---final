import { updateUser } from '@/apis/user.api'
import { useAuth } from '@/contexts/auth-context'
import { TUser } from '@/types/user.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

export const useEditUser = () => {
  const queryClient = useQueryClient()
  const { accessToken } = useAuth()

  const updateUserMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: (body: TUser) => updateUser(body, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('Update User successfully!')
    },
    onError: () => {
      message.error('Update User failed!')
    }
  })

  const handleEditUser = (body: TUser) => {
    updateUserMutation.mutate(body)
  }

  return { handleEditUser, updateUserMutation }
}
