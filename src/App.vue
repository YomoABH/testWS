<script setup lang="ts">
// #region imports
import { MaybeRef, onMounted, ref, toValue } from 'vue'
import { $socket, getChuckNorrisJoke } from './api'
import ChatMessages from './components/ChatMessages.vue'
import { Message } from './common'
// #endregion

// #region state and bl
const inputValue = ref<string>('')
const messages = ref<Message[]>([])
const userId = ref<string>(generateUserId())

const onSendMessage = () => {
   sendMessage(userId, inputValue)
   inputValue.value = ''
}

const onSendJoke = async () => {
   const joke = await getChuckNorrisJoke()
   sendMessage(userId, joke ?? 'Чак не в настроении')
}

onMounted(() => {
   $socket.on('message', (newMessage: Message) => saveNewMessage(newMessage))
   $socket.on('error', (error) => console.error(error)) // можно придумать что-то более полезное, щас просто показываю что такая возможность есть ))
})
// #endregion

// #region implementation func
function saveNewMessage(message: Message): void {
   messages.value = [ ...messages.value, message ]
}

function generateUserId(): string {
   const timePart = Date.now().toString(36).slice(-4) 
   const randomPart = Math.random().toString(36).slice(-2) 
   return (timePart + randomPart).toUpperCase()
}

function sendMessage (userId: MaybeRef<string>, text: MaybeRef<string>): void {
   const textValue = toValue(text)
   // вообще тут и сценарий ошибки продумать можно
   if(!textValue) return 
   if(textValue.length > 337) return 
   $socket.send({
      text: textValue,
      userId: toValue(userId),
      time: new Date().toLocaleTimeString()
   })
   
}
// #endregion
</script>

<template>
	<div class="chat-container">
		<header class="chat-header">
			<h2>Чат</h2>
		</header>

      <ChatMessages 
         :messages="messages"
         :user-id="userId"
      />

		<footer class="chat-footer">
			<div class="input-container">
				<input
               v-model.trim="inputValue" 
               type="text"
               placeholder="Введите сообщение..." 
               class="message-input" 
            />

				<button 
               :disabled="!inputValue" 
               @click="onSendMessage" 
               class="send-button">
               Отправить
            </button>
			</div>
			<button @click="onSendJoke" class="chuck-button">Шутка от Чака :></button>
		</footer>
	</div>
</template>

<style scoped>
.chat-container {
	width: 100%;
	max-width: 600px;
	height: 80vh;
	margin: 0 auto;
	border: 1px solid #ccc;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	background-color: #f9f9f9;
	overflow: hidden;
}

.chat-header {
	padding: 10px;
	background-color: #4a90e2;
	color: white;
	text-align: center;
}

.chat-header h2 {
	margin: 0;
	font-size: 1.5em;
}

.chat-messages {
	flex: 1;
	padding: 15px;
	overflow-y: auto;
}

.message {
	margin-bottom: 15px;
	padding: 10px;
	border-radius: 5px;
	max-width: 70%;
}

.message.incoming {
	background-color: #684ae2;
	align-self: flex-start;
}

.message.outgoing {
	background-color: #4a90e2;
	color: white;
	margin-left: auto;
}

.message p {
	margin: 0;
	word-wrap: break-word;
	font-weight: 500;
}

.timestamp {
	font-size: 0.8em;
	color: #e0dfdf;
	display: block;
	margin-top: 5px;
}

.chat-footer {
	padding: 10px;
	border-top: 1px solid #ccc;
	background-color: #fff;
}

.input-container {
	display: flex;
	gap: 10px;
	margin-bottom: 10px;
}

.message-input {
	flex: 1;
	padding: 8px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1em;
}

.send-button {
	padding: 8px 15px;
	background-color: #4a90e2;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.send-button:disabled {
   opacity: .7;
   cursor: not-allowed;
}

.send-button:hover {
	background-color: #357abd;
}

.chuck-button {
	padding: 8px 15px;
	background-color: #f39c12;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	width: 100%;
}

.chuck-button:hover {
	background-color: #e08e0b;
}
</style>
