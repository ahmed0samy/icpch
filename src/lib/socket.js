import { io } from 'socket.io-client'

export const socket = io('icpchserv-production.up.railway.app', {
  transports: ['websocket']
})
