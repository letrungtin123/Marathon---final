export type Message = {
  _id: string
  content: string
  sender: Sender
  room: RoomRefMesage
  createdAt: string
  updatedAt: string
}

export type Sender = {
  _id: string
  email: string
}

export type RoomRefMesage = {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type BodySendMessage = {
  content: string
  sender: string
  room: string
}
