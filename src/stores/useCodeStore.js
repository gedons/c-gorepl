// stores/code.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCodeStore = defineStore('code', {
  state: () => ({
    code: `\n// You can edit this code!\n// Click here and start typing.\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world!")\n}`,
    output: '',
    error: '',
    loading: false,
    stdin: '', 
  }),
  actions: {
    async runCode() {
      this.loading = true
      this.output = ''
      this.error = ''
      try {
        const resp = await axios.post('/api/run', {
          code: this.code,
          stdin: this.stdin, 
        })
        this.output = resp.data.stdout
        this.error = resp.data.stderr
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
      return { output: this.output, error: this.error }
    }
  }
})
