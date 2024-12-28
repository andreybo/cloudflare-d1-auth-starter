export default {
    scriptPath: "src/index.js", // Path to your main Worker script
    watch: true,                 // Watch for file changes and reload
    modules: true,               // Enable ES modules support
    kvPersist: "kv-data",        // Directory to persist KV data locally
    kvNamespaces: [
      { binding: "SESSION_KV" }, // Define your KV namespace binding
    ],
    bindings: {
      AUTH_DB: "106627a3-b7f6-4c64-ab9b-3ec0335b782d", // D1 database binding
    },
  };
  