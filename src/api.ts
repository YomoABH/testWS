import { createSocket } from "./lib/SocketManager"

export const $socket = createSocket(
   "wss://s14395.nyc1.piesocket.com/v3/1?api_key=wxLxmHNRQ8a5OXRbyUtd0jga6RSZU3cxcEcXA8SB&notify_self=1"
)
// по хорошему тут надо делать иначе, но перебор для одного запроса был бы
export async function getChuckNorrisJoke(): Promise<string> {
   try {
      const response = await fetch("https://api.chucknorris.io/jokes/random")
      if (!response.ok) {
         throw new Error("Не удалось загрузить шутку")
      }
      const data = await response.json()
      return data.value
   } catch (error) {
      console.error("Ошибка при загрузке шутки:", error)
      return "Чак Норрис сломал API)))"
   }
}
