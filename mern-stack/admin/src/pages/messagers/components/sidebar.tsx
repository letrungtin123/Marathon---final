import { Link, createSearchParams } from 'react-router-dom'

import { getAllRooms } from '@/apis/room.api'
import path from '@/configs/path'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'

const Sidebar = () => {
  const { accessToken } = useAuth()

  // get all rooms
  const { data: dataRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getAllRooms(accessToken)
  })
  const rooms = dataRooms?.docs

  return (
    <div className='h-full p-4 overflow-y-scroll'>
      {rooms &&
        rooms.length > 0 &&
        rooms.map((room) => {
          return (
            <Link
              // to={`${path.messagers}?roomId=${room._id}`}
              to={{
                pathname: path.messagers,
                search: createSearchParams({
                  roomId: room._id
                }).toString()
              }}
              className='flex items-center gap-3 p-3 border-b rounded cursor-pointer hover:bg-gray-200'
              key={`${room._id}`}
            >
              <img src='https://picsum.photos/536/354' alt='logo' className='h-[40px] w-[40px] rounded-full' />
              <p className='font-medium'>{room.name}</p>
            </Link>
          )
        })}
    </div>
  )
}

export default Sidebar
