// #region types
interface SocketEvents {
   open: string
   message: any
   error: Event
   close: string
}

type SendData = string | any
// #endregion

// #region implement
// Мелкая абстракция., для приятной жизни. ПО сути паттерн eventEmiter
class SocketManager {
   private socket: WebSocket
   private listeners: Map<keyof SocketEvents, Array<(data: any) => void>>

   constructor(url: string) {
      this.socket = new WebSocket(url)
      this.listeners = new Map<keyof SocketEvents, Array<(data: any) => void>>()
      this.init()
   }

   private init(): void {
      this.socket.onopen = () => {
         this.emit("open", "Соединение установлено")
      }

      this.socket.onmessage = (event: MessageEvent) => {
         this.emit("message", JSON.parse(event.data))
      }

      this.socket.onerror = (error: Event) => {
         // в реальности сюда надо вплести вызов Хендлера
         // лиюбо вшлить один общий или передавать уникальные под каждый сокет
         // от реальной задачи зависит
         // для реакции ui событие error прослушивается ))
         this.emit("error", error)
      }

      this.socket.onclose = () => {
         this.emit("close", "Соединение закрыто")
      }
   }


   public send(data: SendData): void {
      if (this.socket.readyState === WebSocket.OPEN) {
         this.socket.send(JSON.stringify(data))
      } else {
         console.warn("Сокет не подключён")
      }
   }

   public on<T extends keyof SocketEvents>(eventName: T, callback: (data: SocketEvents[T]) => void): void {
      if (!this.listeners.has(eventName)) {
         this.listeners.set(eventName, [])
      }
      this.listeners.get(eventName)!.push(callback)
   }

   private emit<T extends keyof SocketEvents>(eventName: T, data: SocketEvents[T]): void {
      const callbacks = this.listeners.get(eventName) || []
      callbacks.forEach((callback) => callback(data))
   }

   public close(): void {
      this.socket.close()
   }

   public get readyState(): number {
      return this.socket.readyState
   }
}
// #endregion

// #region exports
export const createSocket = (url: string): SocketManager => new SocketManager(url)
// #endregion
