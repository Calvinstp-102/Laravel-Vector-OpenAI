<template>
  <div class="h-100 d-flex flex-column">
    <!-- Header -->
    <div class="mb-3">
      <h5 class="text-warning mb-0">📁 File Management</h5>
    </div>

    <!-- Upload -->
    <div class="mb-3 d-flex align-items-center gap-2">
      <input type="file" class="form-control" multiple @change="handleFileChange" />
      <button class="btn btn-success" @click="uploadFiles" :disabled="!files.length">Upload</button>
    </div>

    <!-- File List -->
    <div class="flex-grow-1 overflow-auto">
      <div v-if="fileList.length === 0" class="d-flex flex-column justify-content-center align-items-center text-light py-5" style="min-height: 200px;">
        <div class="fs-4 mb-2">📁</div>
        <div class="fw-semibold text-light">Belum ada data file yang tersedia.</div>
      </div>

      <table v-else class="table table-dark table-hover table-sm align-middle">
        <thead class="table-active text-warning">
          <tr>
            <th>#</th>
            <th>Nama File</th>
            <th>Uploaded</th>
            <th>Status</th>
            <th class="text-end">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in fileList" :key="file.id">
            <td>{{ index + 1 + (pagination.current_page - 1) * pagination.per_page }}</td>
            <td class="fw-bold">{{ file.filename }}</td>
            <td>{{ formatDate(file.created_at) }}</td>
            <td>
              <span
                :class="[
                  'fw-semibold',
                  file.vector_store_id ? 'text-success' : 'text-warning'
                ]"
              >
                {{ file.vector_store_id ? 'Terhubung' : 'Belum terhubung' }}
              </span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-danger" @click="deleteFile(file)">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3" v-if="fileList.length > 0">
        <div>Halaman {{ pagination.current_page }} dari {{ totalPages }}</div>
        <div class="btn-group btn-group-sm">
          <button
            v-if="pagination.current_page > 1"
            class="btn btn-outline-light"
            @click="fetchFiles(pagination.current_page - 1)"
          >
            ⬅️ Prev
          </button>
          <button
            v-if="pagination.current_page < totalPages"
            class="btn btn-outline-light"
            @click="fetchFiles(pagination.current_page + 1)"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../api.js'
import Swal from 'sweetalert2'

export default {
  name: 'Files',
  data() {
    return {
      fileList: [],
      files: [],
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
    this.fetchFiles()
  },
  methods: {
    async fetchFiles(page = 1) {
      const res = await Api.getFiles({ page })
      this.fileList = res.data.data.data
      this.pagination.current_page = res.data.data.current_page
      this.pagination.per_page = res.data.data.per_page
      this.pagination.total = res.data.data.total
    },

    handleFileChange(event) {
      this.files = Array.from(event.target.files).slice(0, 5)
    },

    async uploadFiles() {
      if (this.files.length === 0) return

      const formData = new FormData()
      this.files.forEach((file) => {
        formData.append('files[]', file)
      })

      await Api.uploadFiles(formData)
      this.files = []
      this.fetchFiles(this.pagination.current_page)
    },

    async deleteFile(file) {
      const result = await Swal.fire({
        title: 'Hapus File?',
        text: `File "${file.filename}" akan dihapus permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e3342f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      })

      if (result.isConfirmed) {
        await Api.deleteFile(file.id)
        this.fetchFiles(this.pagination.current_page)
        Swal.fire({
          title: 'Dihapus!',
          text: `File "${file.filename}" telah dihapus.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString()
    },
  }
}
</script>

<style scoped>
input[type='file']::file-selector-button {
  background-color: #444;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
}
input[type='file'] {
  background-color: #2c2c2c;
  color: #eee;
  border: 1px solid #444;
}
input[type='file']:focus {
  border-color: #00ffff;
  box-shadow: 0 0 0 0.1rem rgba(0, 255, 255, 0.3);
}
</style>
