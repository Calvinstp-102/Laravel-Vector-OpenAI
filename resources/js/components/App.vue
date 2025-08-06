<template>
  <div class="container-fluid py-4 px-4 bg-dark min-vh-100">
    <!-- ROW: Vector Store + Files + Assistants -->
    <div class="row g-4">
      <!-- Left: Vector Stores -->
      <div class="col-md-5">
        <div class="card shadow card-fixed-double">
          <VectorStores />
        </div>
      </div>

      <!-- Right: Files + Assistants stacked -->
      <div class="col-md-7 d-flex flex-column gap-4">
        <div class="card shadow card-fixed">
          <Files />
        </div>
        <div class="card shadow card-fixed">
          <Assistants />
        </div>
      </div>
    </div>

    <!-- ROW: Chat + History -->
    <div class="row g-3 mt-2">
      <!-- Kiri: Chat.vue -->
      <div class="col-md-6">
        <div class="card bg-dark text-light h-100">
          <div class="card-body">
            <Chat />
          </div>
        </div>
      </div>

      <!-- Kanan: ChatHistory.vue -->
      <div class="col-md-6">
        <div class="card bg-dark text-light h-100">
          <div class="card-body">
            <ChatHistory />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VectorStores from './VectorStores.vue'
import Files from './Files.vue'
import Assistants from './Assistants.vue'
import Chat from './Chat.vue'
import ChatHistory from './ChatHistory.vue'

export default {
  name: 'App',
  components: {
    VectorStores,
    Files,
    Assistants,
    Chat,
    ChatHistory,
  },
}
</script>

<style scoped>
/* === GLOBAL DARK THEME === */
body {
  background-color: #111 !important;
  color: #eee;
  font-family: 'Segoe UI', sans-serif;
}

.bg-dark {
  background-color: #121212 !important;
  color: #eee !important;
}

.card {
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
}

/* FIXED HEIGHT CARD UTAMA */
.card-fixed {
  height: 380px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.card-fixed > * {
  overflow-y: auto;
}

/* VectorStore double height */
.card-fixed-double {
  height: 780px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.card-fixed-double > * {
  overflow-y: auto;
}

/* CHAT FULL WIDTH CARD */
.card-tall {
  height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.card-tall > * {
  overflow-y: auto;
}

/* FORM ELEMENTS */
input, select, textarea, .form-control {
  background-color: #2c2c2c !important;
  color: #eee !important;
  border: 1px solid #444 !important;
}
input:focus, select:focus, textarea:focus {
  border-color: #00ffff !important;
  box-shadow: 0 0 0 0.1rem rgba(0, 255, 255, 0.2) !important;
}

/* OTHERS */
.btn {
  font-weight: 500;
}
.list-group-item {
  background-color: #1a1a1a;
  border-color: #333;
  color: #eee;
}
</style>
