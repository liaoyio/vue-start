import axios from 'axios'

export interface MessageRecord {
  id: number
  type: string
  title: string
  subTitle: string
  avatar?: string
  content: string
  time: string
  status: 0 | 1
  messageType?: number
}

export type MessageListType = MessageRecord[]

export const queryMessageList = () => axios.post<MessageListType>('/message/list')

interface MessageStatus {
  ids: number[]
}

export const setMessageStatus = (data: MessageStatus) => axios.post<MessageListType>('/message/read', data)

export interface ChatRecord {
  id: number
  username: string
  content: string
  time: string
  isCollect: boolean
}

export const queryChatList = () => axios.post<ChatRecord[]>('/chat/list')
