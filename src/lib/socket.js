import { io } from 'socket.io-client'

export const socket = io('https://icpchserv-production.up.railway.app', {
  transports: ['polling'] // fallback if wss fails
})

