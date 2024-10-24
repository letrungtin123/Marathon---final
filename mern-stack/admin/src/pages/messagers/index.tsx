import { BodySendMessage, Message } from '@/types/message.type'
import { Socket, io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'

import Content from './components/content'
import Sidebar from './components/sidebar'
import { getAllMessagers } from '@/apis/message.api'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/useQueryParams'

const Messagers = () => {
  const { roomId } = useQueryParams()
  const { accessToken } = useAuth()

  const socketRef = useRef<null | Socket>(null)

  // xử lý logic connect socket chỉ 1 lần
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:8080')
    }

    // xoá bỏ connect khi thoát khỏi message
    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

  // useRef
  const [messagers, setMessagers] = useState<Message[]>([])

  // get all messagers
  const { data: dataMessagers } = useQuery({
    queryKey: ['messagers'],
    queryFn: () => getAllMessagers(roomId, accessToken),
    enabled: !!roomId
  })

  useEffect(() => {
    if (dataMessagers) {
      setMessagers(dataMessagers?.docs)
    }
  }, [dataMessagers])

  // tạo 1 hàm join room
  useEffect(() => {
    if (roomId && socketRef.current) {
      socketRef.current.emit('join-room', roomId)
    }
  }, [roomId])

  // tạo 1 hàm send message
  const handleSendMessage = (data: BodySendMessage) => {
    socketRef.current?.emit('send-message', data)
  }

  // tạo 1 hàm nhận message
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('received-message', (data: Message) => {
        console.log('🚀 ~ socketRef.current.on ~ data:', data)
        setMessagers((prev) => [...prev, data])
      })
    }

    // dọn dẹp lại event
    return () => {
      socketRef.current?.off('received-message')
    }
  }, [])

  return (
    <div className='grid h-full grid-cols-4'>
      <Sidebar />

      <Content onSendMessage={handleSendMessage} messagers={messagers} />
    </div>
  )
}

export default Messagers
