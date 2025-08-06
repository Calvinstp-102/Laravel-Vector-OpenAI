<template>
  <div class="h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="text-warning mb-0">📁 Riwayat Chat (Thread History)</h5>
    </div>

    <!-- === LIST MODE === -->
    <div v-if="viewMode === 'list'" class="flex-grow-1 overflow-auto">
      <div v-if="threads.length === 0" class="text-center text-light py-5">
        <div class="fs-4 mb-2">📭</div>
        <div class="fw-semibold">Belum ada data chat.</div>
      </div>

      <table v-else class="table table-dark table-hover table-sm align-middle">
        <thead class="table-active text-warning">
          <tr>
            <th>#</th>
            <th>Thread</th>
            <th>Assistant</th>
            <th>Dibuat</th>
            <th class="text-end">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(thread, index) in threads" :key="thread.id">
            <td>{{ index + 1 + (pagination.current_page - 1) * pagination.per_page }}</td>
            <td>Thread #{{ thread.id }}</td>
            <td>{{ thread.assistant_name || '-' }}</td>
            <td>{{ formatDate(thread.created_at) }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-info" @click="openThread(thread)">🔍</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3" v-if="threads.length > 0">
        <div>Halaman {{ pagination.current_page }} dari {{ totalPages }}</div>
        <div class="btn-group btn-group-sm">
          <button
            v-if="pagination.current_page > 1"
            class="btn btn-outline-light"
            @click="fetchThreads(pagination.current_page - 1)"
          >
            ⬅️ Prev
          </button>
          <button
            v-if="pagination.current_page < totalPages"
            class="btn btn-outline-light"
            @click="fetchThreads(pagination.current_page + 1)"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>

    <!-- === DETAIL MODE === -->
    <div v-else class="flex-grow-1 d-flex flex-column">
      <h6 class="text-warning mb-2">📁 Isi Thread #{{ selectedThread.id }}</h6>

      <div class="chat-body mb-3 flex-grow-1 overflow-auto">
        <div v-if="messages.length === 0" class="text-light text-center">Belum ada isi percakapan.</div>
        <div v-for="(msg, index) in messages" :key="index">
          <div v-if="msg.role === 'user'" class="d-flex justify-content-start mb-2">
            <div class="bg-primary text-white rounded px-3 py-2 shadow-sm chat-bubble-user">
              {{ msg.content }}
            </div>
          </div>
          <div v-else class="d-flex justify-content-end mb-2">
            <div class="bg-secondary text-light rounded px-3 py-2 shadow-sm chat-bubble-assistant">
              {{ msg.content }}
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-outline-light btn-sm align-self-start" @click="viewMode = 'list'">⬅️ Kembali</button>
    </div>
  </div>
</template>

<script>
import Api from '../api.js'

export default {
  name: 'ChatHistory',
  data() {
    return {
      viewMode: 'list',
      threads: [],
      selectedThread: null,
      messages: [],
      pagination: {
        current_page: 1,
        per_page: 5,
        total: 0,
      },
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.per_page)
    },
  },
  mounted() {
    this.fetchThreads()
  },
  methods: {
    async fetchThreads(page = 1) {
      try {
        const res = await Api.getThreads({ page })
        this.threads = res.data.data.data
        this.pagination.current_page = res.data.data.current_page
        this.pagination.per_page = res.data.data.per_page
        this.pagination.total = res.data.data.total
      } catch (error) {
        console.error('Gagal mengambil thread:', error)
      }
    },
    async openThread(thread) {
      this.selectedThread = thread
      const res = await Api.getMessagesByThread(thread.id)
      this.messages = res.data.data || []
      this.viewMode = 'detail'

      this.$nextTick(() => {
        const el = this.$el.querySelector('.chat-body')
        if (el) el.scrollTop = el.scrollHeight
      })
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
  },
}
</script>

<style scoped>
.chat-body {
  background-color: #1f1f1f;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #333;
  max-height: 400px;
  overflow-y: auto;
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
</style>