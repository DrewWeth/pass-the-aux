import io from 'socket.io-client'
import { PlaybackInfo } from '../spotify/types'

let room: string | null = null
const socket = io('http://localhost:3001')

socket.on('track-update', (data: PlaybackInfo) => {
  console.log("TRACK-update", data)
})

socket.on('member-added', (name: string) => {
  console.log("member-added", name)
})

socket.on('member-removed', (name: string) => {
  console.log("member-removed", name)
})

export const create = async (roomname: string, username: string) => {
  if(room !== null){
    throw new Error("Already connected to a room")
  }
  socket.emit('create-room', { roomname, username })
  socket.on('create-room-success', (_roomname: string) => {
    room = _roomname
    console.log('connected to: ', room)
  })
  socket.on('create-room-failed', (err: string) => {
    console.error(err)
    // TODO: handle error
  })
}

export const connect = async (roomname: string, username: string) => {
  if(room !== null){
    throw new Error("Already connected to a room")
  }
  socket.emit('connect-to-room', { roomname, username })
  room = roomname
  socket.on('connect-to-room-success', (_roomname: string) => {
    room = _roomname
    console.log('connected to: ', room)
  })
  socket.on('connect-to-room-failed', (err: string) => {
    console.error(err)
    // TODO: handle error
  })
}

export const trackUpdate = async(update: PlaybackInfo) => {
  if(room === null){
    throw new Error("Not connected to a room yet")
  }
  socket.emit('track-update', update)
}

export default {
  create, 
  connect,
  trackUpdate
}