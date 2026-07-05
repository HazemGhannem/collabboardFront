import { io, type Socket } from 'socket.io-client';

/**
 * A single socket instance shared across the entire app.
 * Using a singleton means:
 *  - Only one WebSocket connection regardless of how many components mount/unmount
 *  - No duplicate event listeners from multiple `io()` calls
 *  - The connection persists across page navigations (Next.js client-side routing)
 */
const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER!, {
  withCredentials: true,
  autoConnect: false, // connect manually when the user is authenticated
});
console.log(process.env.NEXT_PUBLIC_SERVER);

export default socket;
