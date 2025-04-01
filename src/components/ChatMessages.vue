<script setup lang="ts" >
import {defineProps} from 'vue'
import { Message } from '../common';

const props = defineProps<{
   messages: Message[],
   userId: string
}>()

const getMessageClass = (id: string): string =>{
   return id === props.userId ?
         'message outgoing' : 
         'message incoming'
} 
</script>Ц

<template>
		<div class="chat-messages">
			<div 
            v-for="message in props.messages" 
            :key="message.text+message.time" 
            :class="getMessageClass(message.userId)">

				<p>{{ message.text }}</p>

				<span class="timestamp">{{message.time}}</span>
			</div>
		</div>
</template>

<style scoped>
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
</style>
