// resources/js/api.js

import CONFIG from "./config.js";
import axios from "axios";

export default {
    // Vector Store
    async getVectorStores(params = {}) {
        return await axios.get(CONFIG.VECTORSTORES.LIST, { params });
    },

    async createVectorStore(params) {
        return await axios.post(CONFIG.VECTORSTORES.CREATE, params);
    },

    async updateVectorStore(id, params) {
        return await axios.put(CONFIG.VECTORSTORES.UPDATE(id), params);
    },

    async deleteVectorStore(id) {
        return await axios.delete(CONFIG.VECTORSTORES.DELETE(id));
    },

    // File Management
    async getFiles(params = {}) {
        return await axios.get(CONFIG.FILES.LIST, { params });
    },

    async uploadFiles(formData) {
        return await axios.post(CONFIG.FILES.UPLOAD, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    async deleteFile(id) {
        return await axios.delete(CONFIG.FILES.DELETE(id));
    },

    // Assistant Management
    async getAssistants(params = {}) {
        return await axios.get(CONFIG.ASSISTANT.LIST, { params });
    },

    async createAssistant(params) {
        return await axios.post(CONFIG.ASSISTANT.CREATE, params);
    },

    async deleteAssistant(id) {
        return await axios.delete(CONFIG.ASSISTANT.DELETE(id));
    },

    async sendMessage(params) {
        return await axios.post(CONFIG.CHAT.SEND, params);
    },

    async getMessages(threadId) {
        return await axios.get(CONFIG.CHAT.HISTORY(threadId));
    },

    async resetChat(params) {
        return await axios.post(CONFIG.CHAT.RESET, params);
    },

    async getThreads(params) {
        return await axios.get(CONFIG.CHAT.THREADS, { params });
    },

    async getMessagesByThread(id) {
        return await axios.get(CONFIG.CHAT.HISTORY(id));
    },

    async getThreadDetail(id) {
        return await axios.get(CONFIG.CHAT.HISTORY(id));
    },

    // File Relasi
    async getUnassignedFiles() {
        return await axios.get(CONFIG.FILES.UNASSIGNED);
    },

    async getFilesByVectorStore(storeId) {
        return await axios.get(CONFIG.VECTORSTORES.FILES(storeId));
    },

    async attachFilesToVectorStore(storeId, payload) {
        return await axios.post(
            CONFIG.VECTORSTORES.ATTACH_FILES(storeId),
            payload
        );
    },

    async detachFile(fileId) {
        return await axios.post(CONFIG.FILES.DETACH(fileId));
    },

    // Assistant ↔ Vector Store
    async getUnassignedAssistants() {
        return await axios.get(CONFIG.ASSISTANT.UNASSIGNED);
    },

    async getAssistantsByVectorStore(storeId) {
        return await axios.get(CONFIG.VECTORSTORES.ASSISTANTS(storeId));
    },

    async attachAssistantsToVectorStore(storeId, payload) {
        return await axios.post(
            CONFIG.VECTORSTORES.ATTACH_ASSISTANTS(storeId),
            payload
        );
    },

    async detachAssistant(id) {
        return await axios.post(CONFIG.ASSISTANT.DETACH(id));
    },

    async getLinkedAssistants() {
        return await axios.get(CONFIG.ASSISTANT.LINKED);
    },

    async createThread(params) {
        return await axios.post(CONFIG.THREAD.CREATE, params);
    },

    async sendMessageToAssistant(params) {
        return await axios.post(CONFIG.CHAT.SEND, params);
    },

    async getAssistantDetail(id) {
        return await axios.get(CONFIG.ASSISTANT.DETAIL(id));
    },
    async updateAssistant(id, params) {
        return await axios.put(CONFIG.ASSISTANT.UPDATE(id), params);
    },
};
