"use client"
import { useEffect } from 'react'
import Peer from 'simple-peer'
import { socket } from '@/lib/socket'

export default function User() {
  useEffect(() => {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
      const peer = new Peer({ initiator: true, trickle: false, stream })

      peer.on('signal', signal => {
        socket.emit('user-ready', signal)
      })

      socket.on('admin-accepted', answer => {
        peer.signal(answer)
      })
    })
  }, [])

  return <p>Screen sharing started...</p>
}
