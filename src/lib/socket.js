import { io } from 'socket.io-client'

export const socket = io('https://icpchserv-production-c8ae.up.railway.app', {
  transports: ['polling'] // fallback if wss fails
})

