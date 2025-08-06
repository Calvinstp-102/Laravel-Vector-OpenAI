<template>
  <div class="h-100 d-flex flex-column">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="text-info mb-0">🤖 Assistant Management</h5>
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
      <div
        v-if="assistants.length === 0"
        class="d-flex flex-column justify-content-center align-items-center text-light py-5"
        style="min-height: 200px"
      >
        <div class="fs-4 mb-2">🤖</div>
        <div class="fw-semibold text-light">
          Belum ada data assistant yang tersedia.
        </div>
      </div>

      <table v-else class="table table-dark table-hover table-sm align-middle">
        <thead class="table-active text-info">
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Dibuat</th>
            <th>Status</th>
            <th class="text-end">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(assistant, index) in assistants" :key="assistant.id">
            <td>
              {{
                index + 1 + (pagination.current_page - 1) * pagination.per_page
              }}
            </td>
            <td class="fw-bold">{{ assistant.name }}</td>
            <td>{{ formatDate(assistant.created_at) }}</td>
            <td>
              <span
                :class="
                  assistant.vector_store_id
                    ? 'text-success fw-semibold'
                    : 'text-warning fw-semibold'
                "
              >
                {{
                  assistant.vector_store_id ? "Terhubung" : "Belum terhubung"
                }}
              </span>
            </td>
            <td class="text-end">
              <button
                class="btn btn-sm btn-outline-info"
                @click="openDetail(assistant)"
              >
                👁️ Detail
              </button>
              <button
                class="btn btn-sm btn-outline-warning"
                @click="openEdit(assistant)"
              >
                ✏️ Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteAssistant(assistant)"
              >
                🗑️ Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        class="d-flex justify-content-between align-items-center mt-3"
        v-if="assistants.length > 0"
      >
        <div>Halaman {{ pagination.current_page }} dari {{ totalPages }}</div>
        <div class="btn-group btn-group-sm">
          <button
            v-if="pagination.current_page > 1"
            class="btn btn-outline-light"
            @click="fetchAssistants(pagination.current_page - 1)"
          >
            ⬅️ Prev
          </button>
          <button
            v-if="pagination.current_page < totalPages"
            class="btn btn-outline-light"
            @click="fetchAssistants(pagination.current_page + 1)"
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>

    <!-- === DETAIL MODE === -->
    <div v-else-if="viewMode === 'detail'" class="flex-grow-1">
      <h6 class="text-info">Detail Assistant: {{ selectedAssistant.name }}</h6>

      <!-- Assistant Details -->
      <div class="mb-4">
        <p>
          <strong>Instruksi Sistem:</strong>
          {{
            selectedAssistant.system_instructions ||
            "Tidak ada instruksi sistem."
          }}
        </p>
        <p>
          <strong>File Search:</strong>
          {{ selectedAssistant.file_search ? "Aktif" : "Tidak Aktif" }}
        </p>
        <p>
          <strong>Code Interpreter:</strong>
          {{ selectedAssistant.code_interpreter ? "Aktif" : "Tidak Aktif" }}
        </p>
        <button
          class="btn btn-sm btn-outline-primary"
          @click="viewMode = 'edit'"
        >
          ✏️ Edit
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="viewMode = 'list'"
        >
          Kembali
        </button>
      </div>
    </div>

    <!-- === EDIT MODE === -->
    <div v-if="viewMode === 'edit'" class="flex-grow-1">
      <h6 class="text-info">Edit Assistant: {{ selectedAssistant.name }}</h6>

      <div class="mb-3">
        <label class="form-label">Nama Assistant:</label>
        <input type="text" class="form-control" v-model="editAssistant.name" />
      </div>

      <div class="mb-3">
        <label class="form-label">Instruksi Sistem:</label>
        <textarea
          class="form-control"
          v-model="editAssistant.system_instructions"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">File Search:</label>
        <input type="checkbox" v-model="editAssistant.file_search" />
      </div>

      <div class="mb-3">
        <label class="form-label">Code Interpreter:</label>
        <input type="checkbox" v-model="editAssistant.code_interpreter" />
      </div>

      <button class="btn btn-success" @click="submitEdit">Simpan</button>
      <button class="btn btn-outline-secondary" @click="viewMode = 'detail'">
        Batal
      </button>
    </div>
  </div>
</template>

<script>
import Api from "../api.js";

export default {
  name: "Assistants",
  data() {
    return {
      viewMode: "list",
      assistants: [],
      selectedAssistant: null,
      editAssistant: {},
      pagination: {
        current_page: 1,
        per_page: 5,
        total: 0,
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.pagination.per_page);
    },
  },
  mounted() {
    this.fetchAssistants();
  },
  methods: {
    async fetchAssistants(page = 1) {
      const res = await Api.getAssistants({ page });
      this.assistants = res.data.data.data;
      this.pagination.current_page = res.data.data.current_page;
      this.pagination.per_page = res.data.data.per_page;
      this.pagination.total = res.data.data.total;
    },

    async openDetail(assistant) {
      this.selectedAssistant = assistant;
      const res = await Api.getAssistantDetail(assistant.id);
      this.selectedAssistant = res.data.data;
      this.viewMode = "detail";
    },

    async openEdit(assistant) {
      this.editAssistant = { ...assistant };
      this.viewMode = "edit";
    },

    async submitEdit() {
      const res = await Api.updateAssistant(
        this.editAssistant.id,
        this.editAssistant
      );
      this.selectedAssistant = res.data.data;
      this.viewMode = "detail";
    },

    async deleteAssistant(assistant) {
      const result = await Api.deleteAssistant(assistant.id);
      if (result.status === 200) {
        this.fetchAssistants();
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style scoped>
input.form-control, textarea.form-control {
  background-color: #2c2c2c !important;
  color: #fff !important;
  border: 1px solid #444 !important;
}
input.form-control:focus, textarea.form-control:focus {
  border-color: #00ffff !important;
  box-shadow: 0 0 0 0.1rem rgba(0, 255, 255, 0.3) !important;
}
</style>
