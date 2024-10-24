import { BodySendMessage, Message } from '@/types/message.type'
import { Button, Empty } from 'antd'

import QuillEditor from '@/components/qill-editor'
import { cn } from '@/utils/cn'
import dayjs from 'dayjs'
import { getMeInfo } from '@/apis/profile.api'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useState } from 'react'

interface Props {
  onSendMessage: (data: BodySendMessage) => void
  messagers: Message[]
}

const Content = ({ onSendMessage, messagers }: Props) => {
  const { accessToken } = useAuth()
  const { roomId } = useQueryParams()
  // get me
  const { data: dataInfo } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMeInfo(accessToken)
  })
  const userInfo = dataInfo?.data

  // value
  const [valueInput, setValueInput] = useState<string>('')

  // handle send message
  const handleSendMessage = () => {
    onSendMessage({
      content: valueInput,
      room: roomId,
      sender: userInfo._id
    })

    // reset lại valueInput = ''
    setValueInput('')
  }

  return (
    <div className='flex flex-col w-full h-full col-span-3 p-4 overflow-y-scroll bg-white'>
      {(!messagers || messagers.length === 0) && <Empty />}
      {messagers &&
        messagers.length > 0 &&
        messagers.map((chat) => {
          const isCurrentUserLogin = userInfo._id === (chat.sender._id || chat.sender)

          return (
            <div
              className={cn('flex items-start gap-3 p-3', { 'justify-end': isCurrentUserLogin })}
              key={`${chat._id}`}
            >
              <img
                src={'https://picsum.photos/536/354'}
                alt={chat.sender.email}
                className={cn('h-[40px] w-[40px] rounded-full', { hidden: isCurrentUserLogin })}
              />
              <div
                className={cn('flex flex-col gap-1', { 'items-end': isCurrentUserLogin })}
                title={dayjs().format('DD/MM/YYYY HH:mm:ss')}
              >
                <p className='text-xs'>{dayjs(chat.createdAt).format('HH:mm')}</p>
                <div
                  className={cn(
                    'p-2 bg-gray-100 rounded-md',
                    { 'w-2/3': chat.content.length > 150 },
                    { 'bg-blue-100': isCurrentUserLogin }
                  )}
                >
                  <p
                    className='font-medium'
                    dangerouslySetInnerHTML={{
                      __html: chat.content
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}

      <div className='mt-auto'>
        <QuillEditor value={valueInput} onChange={setValueInput} />
        <Button onClick={() => handleSendMessage()}>Send</Button>
      </div>
    </div>
  )
}

export default Content
