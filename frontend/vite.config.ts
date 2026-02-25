import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
   server: {
    host: true
  },
  plugins: [
    tailwindcss(),

 
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
