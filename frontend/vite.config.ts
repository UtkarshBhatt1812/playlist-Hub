import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
   server: {
    host: "127.0.0.1"
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
//:todo : responsive , upgrade to pro , music player , outh login wth spotify  
