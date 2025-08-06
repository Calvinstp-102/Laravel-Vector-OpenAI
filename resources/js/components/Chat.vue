<template>
  <div class="h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="text-light mb-0">💬 Chat with Assistant</h6>
      <button class="btn btn-sm btn-outline-danger" @click="resetChat">
        Reset Chat
      </button>
    </div>

    <!-- Assistant Selector -->
    <div class="mb-2">
      <select
        class="form-select form-select-sm"
        v-model="selectedAssistantId"
        @change="startNewChat"
      >
        <option value="" disabled selected>-- Pilih Assistant --</option>
        <option
          v-for="assistant in assistants"
          :key="assistant.id"
          :value="assistant.id"
        >
          {{ assistant.name }}
        </option>
      </select>
    </div>

    <!-- Chat Body -->
    <div ref="chatBody" class="chat-body mb-2">
      <div v-if="!selectedThreadId" class="text-muted text-center mt-5">
        Pilih Assistant terlebih dahulu
      </div>

      <div v-for="(msg, i) in messages" :key="i">
        <!-- User -->
        <div
          v-if="msg.role === 'user'"
          class="d-flex justify-content-start mb-2"
        >
          <div
            class="bg-primary text-white rounded px-3 py-2 shadow-sm chat-bubble-user"
          >
            {{ msg.content }}
          </div>
        </div>

        <!-- Assistant -->
        <div v-else class="d-flex justify-content-end mb-2">
          <div
            class="bg-secondary text-light rounded px-3 py-2 shadow-sm chat-bubble-assistant"
            v-html="msg.content"
          ></div>
        </div>
      </div>
    </div>

    <!-- Input Message -->
    <div class="input-group input-group-sm">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        type="text"
        class="form-control"
        placeholder="Ketik pesan..."
        :disabled="!selectedThreadId"
      />
      <button
        class="btn btn-success"
        @click="sendMessage"
        :disabled="!selectedThreadId || !inputMessage"
      >
        Kirim
      </button>
    </div>
  </div>
</template>

<script>
import Api from "../api.js";

export default {
  name: "Chat",
  data() {
    return {
      selectedAssistantId: "",
      selectedThreadId: null,
      assistants: [],
      messages: [],
      inputMessage: "",
    };
  },
  mounted() {
    this.fetchAssistants();
  },
  methods: {
    // Format message untuk mendeteksi \n dan **bold text**
    formatMessage(message) {
      // Replace new lines with <br>
      let formattedMessage = message
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");

      // Replace **bold text** with <strong>bold text</strong>
      formattedMessage = formattedMessage.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );

      return formattedMessage;
    },

    async fetchAssistants() {
      const res = await Api.getLinkedAssistants();
      this.assistants = res.data.data;
    },

    async startNewChat() {
      this.messages = [];
      this.inputMessage = "";
      this.selectedThreadId = null;

      const res = await Api.createThread({
        assistant_id: this.selectedAssistantId,
      });
      this.selectedThreadId = res.data.data.id;
    },

    async sendMessage() {
      if (!this.inputMessage.trim() || !this.selectedThreadId) return;

      const userMessage = { role: "user", content: this.inputMessage };
      this.messages.push(userMessage);

      const res = await Api.sendMessage({
        thread_id: this.selectedThreadId,
        message: this.inputMessage,
      });

      // Parse the assistant's message
      const assistantReply = {
        role: "assistant",
        content: this.formatMessage(
          res.data.data.content || "(Tidak ada respons)"
        ),
      };

      this.messages.push(assistantReply);
      this.inputMessage = "";

      this.$nextTick(() => {
        const body = this.$refs.chatBody;
        body.scrollTop = body.scrollHeight;
      });
    },

    resetChat() {
      this.messages = [];
      this.inputMessage = "";
      this.selectedThreadId = null;
      this.selectedAssistantId = "";
    },
  },
};
</script>

<style scoped>
.chat-body {
  height: 400px;
  overflow-y: auto;
  background-color: #1f1f1f;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #333;
}

.chat-bubble-user {
  max-width: 75%;
  background-color: #0d6efd;
  color: #fff;
  border-bottom-left-radius: 0;
}

.chat-bubble-assistant {
  max-width: 75%;
  background-color: #6c757d;
  color: #fff;
  border-bottom-right-radius: 0;
}

input.form-control {
  background-color: #2c2c2c !important;
  color: #fff !important;
  border: 1px solid #444 !important;
}
input.form-control:focus {
  border-color: #00ffff !important;
  box-shadow: 0 0 0 0.1rem rgba(0, 255, 255, 0.3) !important;
}

select.form-select {
  background-color: #2c2c2c !important;
  color: #fff !important;
  border: 1px solid #444 !important;
}
</style>
