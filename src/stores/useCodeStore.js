import { defineStore } from 'pinia';
import axios from 'axios';

export const useCodeStore = defineStore('code', {
  state: () => ({
    code: `\n// You can edit this code!\n// Click here and start typing.\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world!")\n}`,
    output: '',
    error: '',
    loading: false
  }),
  actions: {
    async runCode() {
      this.loading = true
      this.output = ''
      this.error  = ''
      try {
        const resp = await axios.post(
          'http://repl-go-api-env.eba-kmsvh4jx.us-west-2.elasticbeanstalk.com/run',
          { code: this.code }  
        )
        this.output = resp.data.output
        this.error  = resp.data.error
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
      return { output: this.output, error: this.error }
    }
  }
})
