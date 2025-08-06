<template>
  <div class="h-100 d-flex flex-column">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="text-info mb-0">🧱 Vector Stores</h5>
      <button
        v-if="viewMode === 'list'"
        class="btn btn-sm btn-success"
        @click="viewMode = 'create'"
      >
        ➕ Create
      </button>
    </div>

    <!-- === LIST MODE === -->
    <div v-if="viewMode === 'list'" class="flex-grow-1 overflow-auto">
      <table class="table table-dark table-hover table-sm align-middle">
        <thead class="table-active text-info">
          <tr>
            <th>#</th>
            <th>Nama + Relasi</th>
            <th>Dibuat</th>
            <th class="text-end">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(store, index) in stores" :key="store.id">
            <td>
              {{
                index + 1 + (pagination.current_page - 1) * pagination.per_page
              }}
            </td>
            <td>
              <div class="fw-bold">{{ store.name }}</div>
              <div class="text-secondary small fw-medium">
                📁 {{ store.total_files }} file — 🤖
                {{ store.total_assistants }} assistant
              </div>
            </td>
            <td>{{ formatDate(store.created_at) }}</td>
            <td class="text-end">
              <button
                class="btn btn-sm btn-outline-info me-2"
                @click="openDetail(store)"
              >
                👁
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteStore(store)"
              >
                🗑
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION DINAMIS -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>Halaman {{ pagination.current_page }} dari {{ totalPages }}</div>
        <div class="btn-group btn-group-sm">
          <button
            v-if="pagination.current_page > 1"
            class="btn btn-outline-light"
            @click="fetchStores(pagination.current_page - 1)"
          >
            ⬅️ Prev
          </button>
          <button
            v-if="pagination.current_page < totalPages"
            class="btn btn-outline-light"
            @click="fetchStores(pagination.current_page + 1)"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>

    <!-- === CREATE MODE === -->
    <div v-else-if="viewMode === 'create'" class="flex-grow-1">
      <h6 class="text-info">🆕 Create Vector Store</h6>
      <input
        v-model="newName"
        type="text"
        class="form-control my-3"
        placeholder="Nama Vector Store"
      />
      <div class="d-flex gap-2">
        <button class="btn btn-success" @click="submitCreate">Create</button>
        <button class="btn btn-outline-secondary" @click="viewMode = 'list'">
          Kembali
        </button>
      </div>
    </div>

    <!-- === DETAIL MODE === -->
    <div v-if="viewMode === 'detail'" class="flex-grow-1 overflow-auto">
      <h6 class="text-info mb-3">
        📄 <span class="text-light">Detail:</span> {{ selected.name }}
      </h6>

      <!-- FILE TERHUBUNG -->
      <div class="mb-4">
        <label class="form-label fw-semibold text-light">📁 File Terhubung:</label>
        <div v-if="detailFiles.length === 0" class="text-light mb-2">📁 Tidak ada file terhubung.</div>
        <ul v-else class="list-unstyled mb-2">
          <li v-for="file in detailFiles" :key="file.id" class="text-light">- {{ file.filename }}</li>
        </ul>

        <label class="form-label text-light">Attach File:</label>
        <select v-model="selectedFileIds" multiple class="form-select mb-2">
          <option v-for="file in unassignedFiles" :key="file.id" :value="file.id">
            {{ file.filename }}
          </option>
        </select>
        <button class="btn btn-sm btn-success mt-2" @click="attachFiles">Attach File</button>
      </div>

      <!-- ASSISTANT TERHUBUNG -->
      <div class="mb-4">
        <label class="form-label fw-semibold text-light">🤖 Assistant Terhubung:</label>
        <div v-if="detailAssistants.length === 0" class="text-light mb-2">🤖 Tidak ada assistant terhubung.</div>
        <ul v-else class="list-unstyled mb-2">
          <li v-for="asst in detailAssistants" :key="asst.id" class="text-light">- {{ asst.name }}</li>
        </ul>

        <label class="form-label text-light">Attach Assistant:</label>
        <select v-model="selectedAssistantIds" multiple class="form-select mb-2">
          <option v-for="asst in unassignedAssistants" :key="asst.id" :value="asst.id">
            {{ asst.name }}
          </option>
        </select>
        <button class="btn btn-sm btn-success mt-2" @click="attachAssistants">Attach Assistant</button>
      </div>

      <!-- KEMBALI -->
      <div class="mt-3">
        <button class="btn btn-outline-primary" @click="viewMode = 'list'">⬅️ Kembali</button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../api.js'
import Swal from 'sweetalert2'

export default {
  name: 'VectorStores',
  data() {
    return {
      viewMode: 'list',
      stores: [],
      newName: '',
      selected: null,
      detailFiles: [],
      detailAssistants: [],
      unassignedFiles: [],
      unassignedAssistants: [],
      selectedFileIds: [],
      selectedAssistantIds: [],
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
    this.fetchStores()
  },
  methods: {
    async fetchStores(page = 1) {
      const res = await Api.getVectorStores({ page })
      this.stores = res.data.data.data
      this.pagination.current_page = res.data.data.current_page
      this.pagination.per_page = res.data.data.per_page
      this.pagination.total = res.data.data.total
    },

    async submitCreate() {
      if (!this.newName.trim()) return
      await Api.createVectorStore({ name: this.newName })
      this.newName = ''
      this.viewMode = 'list'
      this.fetchStores()
    },

    async deleteStore(store) {
      const confirm = await Swal.fire({
        title: `Hapus "${store.name}"?`,
        text: "Data tidak bisa dikembalikan.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      });

      if (confirm.isConfirmed) {
        await Api.deleteVectorStore(store.id)
        this.fetchStores()
        Swal.fire('Dihapus!', 'Vector Store berhasil dihapus.', 'success')
      }
    },

    async openDetail(store) {
      this.selected = store
      this.viewMode = 'detail'
      this.selectedFileIds = []
      this.selectedAssistantIds = []

      const [files, unassignedFiles, assistants, unassignedAssistants] = await Promise.all([
        Api.getFilesByVectorStore(store.id),
        Api.getUnassignedFiles(),
        Api.getAssistantsByVectorStore(store.id),
        Api.getUnassignedAssistants(),
      ])
      this.detailFiles = files.data.data || []
      this.unassignedFiles = unassignedFiles.data.data || []
      this.detailAssistants = assistants.data.data || []
      this.unassignedAssistants = unassignedAssistants.data.data || []
    },

    async attachFiles() {
      if (!this.selectedFileIds.length) return
      await Api.attachFilesToVectorStore(this.selected.id, { file_ids: this.selectedFileIds })
      this.openDetail(this.selected)
    },

    async detachFile(id) {
      await Api.detachFile(id)
      this.openDetail(this.selected)
    },

    async attachAssistants() {
      if (!this.selectedAssistantIds.length) return
      await Api.attachAssistantsToVectorStore(this.selected.id, { assistant_ids: this.selectedAssistantIds })
      this.openDetail(this.selected)
    },

    async detachAssistant(id) {
      await Api.detachAssistant(id)
      this.openDetail(this.selected)
    },

    formatDate(date) {
      return new Date(date).toLocaleString()
    },
  },
}
</script>

<style scoped>
.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
}
.form-select,
.form-control {
  background-color: #2b2b2b !important;
  color: #fff !important;
  border: 1px solid #444 !important;
}
.form-select:focus,
.form-control:focus {
  border-color: #00ffff !important;
  box-shadow: 0 0 0 0.1rem rgba(0, 255, 255, 0.3) !important;
}
</style>