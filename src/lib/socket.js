import { io } from 'socket.io-client'

export const socket = io('htttps://icpchserv-production-c8ae.up.railway.app', {
  transports: ['polling'] // fallback if wss fails
})

