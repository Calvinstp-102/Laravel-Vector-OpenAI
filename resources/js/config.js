// resources/js/config.js

const CONFIG = {
    VECTORSTORES: {
        LIST: "/vector-stores",
        CREATE: "/vector-stores",
        UPDATE: (id) => `/vector-stores/${id}`,
        DELETE: (id) => `/vector-stores/${id}`,
        FILES: (id) => `/vector-stores/${id}/files`,
        ATTACH_FILES: (id) => `/vector-stores/${id}/attach-files`,
        ASSISTANTS: (id) => `/vector-stores/${id}/assistants`,
        ATTACH_ASSISTANTS: (id) => `/vector-stores/${id}/attach-assistants`,
    },

    ASSISTANT: {
        LIST: "/assistants",
        CREATE: "/assistants",
        DELETE: (id) => `/assistants/${id}`,
        UNASSIGNED: "/assistants/unassigned",
        DETACH: (id) => `/assistants/${id}/detach`,
        LINKED: "/assistants/linked",
        DETAIL: (id) => `/assistants/${id}`, // Endpoint detail assistant
        UPDATE: (id) => `/assistants/${id}`, // Endpoint update assistant
    },

    FILES: {
        LIST: "/files",
        UPLOAD: "/files/upload",
        DELETE: (id) => `/files/${id}`,
        UNASSIGNED: "/files/unassigned",
        DETACH: (id) => `/files/${id}/detach`,
    },

    CHAT: {
        THREADS: "/chat/threads",
        HISTORY: (id) => `/chat/threads/${id}`,
        SEND: "/chat/send",
        RESET: "/chat/reset",
    },
    THREAD: {
        CREATE: "/thread/create",
    },
};

export default CONFIG;
