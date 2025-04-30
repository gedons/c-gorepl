<template>
  <main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <header class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <h1 class="text-4xl font-extrabold mb-3 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 ">
            Go Playground
          </h1>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <select 
                v-model="selectedExample" 
                @change="onExampleChange" 
                class="appearance-none bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option disabled value="">Select Example</option>
                <option v-for="ex in examples" :key="ex.name" :value="ex.name">{{ ex.name }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Editor controls -->
      <div class="bg-white dark:bg-gray-800 rounded-t-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-3 border-b dark:border-gray-700">
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <span class="font-medium">Theme:</span>
            <div class="relative inline-block">
              <select 
                v-model="isDark" 
                class="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="true">Dark</option>
                <option :value="false">Light</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </label>

          <label class="flex items-center space-x-2">
            <span class="font-medium">Font:</span>
            <div class="flex items-center">
              <input 
                type="range" 
                min="12" 
                max="24" 
                v-model.number="fontSize" 
                class="w-24 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span class="ml-2 w-8 text-right">{{ fontSize }}px</span>
            </div>
          </label>
        </div>

        <button
          @click="copyCode"
          class="cursor-pointer flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg shadow-sm transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
          </svg>
          Copy
        </button>
      </div>

      <!-- Monaco Editor -->
      <div class="h-[500px] border-x border-gray-300 dark:border-gray-700 overflow-hidden">
        <CodeEditor
          v-model="code"
          :theme="isDark ? 'vs-dark' : 'vs-light'"
          :fontSize="fontSize"
          language="go"
        />
      </div>

      <!-- Run button -->
      <div class="flex justify-center bg-white dark:bg-gray-800 rounded-b-xl border-x border-b border-gray-300 dark:border-gray-700 p-4 shadow-md">
        <button
          @click="runCode"
          :disabled="loading"
          class="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow transition-all duration-200 flex items-center justify-center min-w-[120px]"
          :class="{ 'opacity-70 cursor-not-allowed': loading }"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Running...' : 'Run Code' }}
        </button>
      </div>

      <!-- Output / Error -->
      <div class="mt-8 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
          <div class="px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <h2 class="text-lg font-semibold">Output</h2>
          </div>
          <pre class="p-4 max-h-64 overflow-auto whitespace-pre-wrap dark:text-gray-200 font-mono text-sm leading-relaxed">{{ loading ? 'Waiting for remote server...' : (output || '— No output yet —') }}</pre>
        </div>
        
        <div v-if="error" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
          <div class="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 class="text-lg font-semibold">Error</h2>
          </div>
          <pre class="p-4 max-h-64 overflow-auto whitespace-pre-wrap text-red-600 dark:text-red-400 font-mono text-sm leading-relaxed">{{ error }}</pre>
        </div>
      </div>

      <!-- About Section -->
      <div class="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div class="px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-lg font-semibold">About This Project</h2>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-gray-700 dark:text-gray-300">
            <strong>Go Playground REPL</strong> is a browser-based interactive code editor designed to let developers write, run, and test Go code instantly. Inspired by the official Go Playground, this web app serves as a lightweight, real-time REPL environment for rapid prototyping, learning, and experimentation.
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            It features a responsive frontend powered by <strong>Vue.js</strong>, <strong>Pinia</strong>, and <strong>Tailwind CSS</strong>, and a robust backend written in <strong>Go</strong>, containerized with <strong>Docker</strong>, and deployed securely on <strong>AWS Elastic Beanstalk</strong> with automated CI/CD pipelines using <strong>GitHub Actions</strong>.
          </p>

          <div class="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 class="font-semibold text-lg mb-2 flex items-center">
              Security & Sandbox Execution
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              User-submitted Go code is executed inside a <strong>lightweight, isolated Docker container</strong>, ensuring that no untrusted code can access the host system. This sandboxed environment prevents:
            </p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Infinite loops from crashing the server (via timeouts)</li>
              <li>Access to the file system or network</li>
              <li>Arbitrary execution of malicious system commands</li>
            </ul>
            <p class="mt-2 text-gray-700 dark:text-gray-300">
              The backend is designed to safely handle untrusted inputs and enforce resource limits (CPU, memory, execution time) to provide a secure coding environment.
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-2 flex items-center">
              <span class="text-xl mr-2">✨</span> Key Features
            </h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              <li class="flex items-start"><span class="mr-2">🖋</span> Live code editing with <strong>Monaco Editor</strong></li>
              <li class="flex items-start"><span class="mr-2">🌗</span> Dark/Light theme toggle with adjustable font sizes</li>
              <li class="flex items-start"><span class="mr-2">🧠</span> Built-in Go code examples (Fibonacci, Pi computation, etc.)</li>
              <li class="flex items-start"><span class="mr-2">⚡</span> Instant run with real-time output and error display</li>
              <li class="flex items-start"><span class="mr-2">🔄</span> Fully containerized backend for secure execution</li>
              <li class="flex items-start"><span class="mr-2">🚀</span> Deployed with CI/CD automation via GitHub Actions</li>
            </ul>
          </div>

          <p class="text-gray-700 dark:text-gray-300 pt-2">
            Whether you're exploring Go as a beginner or testing out advanced snippets, this REPL is a fast, secure, and developer-friendly playground.
          </p>

          <!-- Social Links and Read More Button -->
          <div class="flex flex-col sm:flex-row justify-between items-center pt-4 border-t dark:border-gray-700">
            <div class="flex space-x-4 mb-4 sm:mb-0">
              <a href="https://github.com/gedons/go_repl" target="_blank" rel="noopener noreferrer" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="https://linkedin.com/in/gedonidev" target="_blank" rel="noopener noreferrer" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
            <a href="#" target="_blank" rel="noopener noreferrer"  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center">
              Read More              
            </a>
          </div>

        </div>
      </div>

      <ToastNotification ref="toast" />
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCodeStore } from '../stores/useCodeStore'
import CodeEditor from '../components/CodeEditor.vue'
import ToastNotification from '../components/ToastNotification.vue'

const store = useCodeStore()
const code = computed({
  get: () => store.code,
  set: v => store.code = v
})
const output = computed(() => store.output)
const error = computed(() => store.error)
const loading = computed(() => store.loading)

const isDark = ref(true)
const fontSize = ref(18)
const selectedExample = ref('')
const toast = ref(null)

// Apply dark mode to document body when isDark changes
watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

const examples = [  
  {
    name: 'Hello World',
    code: `// A simple "Hello, World!" program\npackage main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}`
  },
  {
    name: 'Fibonacci Sequence',
    code: `// Generate the first 10 numbers in the Fibonacci sequence\npackage main

import "fmt"

func main() {
    a, b := 0, 1
    for i := 0; i < 10; i++ {
        fmt.Println(a)
        a, b = b, a+b
    }
}`
  },
  {
    name: 'Compute Pi (Leibniz)',
    code: `// Approximate the value of Pi using the Leibniz series\npackage main

import (
    "fmt"
)

func main() {
    pi := 0.0
    for i := 0; i < 100000; i++ {
        term := 1.0 / float64(2*i+1)
        if i%2 == 0 {
            pi += term
        } else {
            pi -= term
        }
    }
    fmt.Println("Pi ≈", pi*4)
}`
  },
  {
    name: 'Peano Integers',
    code: `// Demonstrate Peano arithmetic and converting Peano numbers to integers\npackage main

import "fmt"

type Peano interface{}

type Zero struct{}
type Succ struct{ Prev Peano }

func toInt(p Peano) int {
    switch v := p.(type) {
    case Zero:
        return 0
    case Succ:
        return 1 + toInt(v.Prev)
    default:
        return -1
    }
}

func main() {
    three := Succ{Succ{Succ{Zero{}}}}
    fmt.Println("Peano to int:", toInt(three)) // Output: 3
}`
  },
  {
    name: 'Factorial',
    code: `// Calculate the factorial of a number using recursion\npackage main

import "fmt"

func factorial(n int) int {
    if n == 0 {
        return 1
    }
    return n * factorial(n-1)
}

func main() {
    fmt.Println("Factorial of 5:", factorial(5))
}`
  },
  {
    name: "Check Prime Number",
    code: "// Check if numbers are prime and print the results\npackage main\n\nimport \"fmt\"\n\nfunc isPrime(n int) bool {\n    if n < 2 {\n        return false\n    }\n    for i := 2; i*i <= n; i++ {\n        if n%i == 0 {\n            return false\n        }\n    }\n    return true\n}\n\nfunc main() {\n    for i := 1; i <= 10; i++ {\n        fmt.Printf(\"%d is prime? %v\\n\", i, isPrime(i))\n    }\n}"
  },
  {
    name: 'Bubble Sort',
    code: `// Sort an array of integers using the Bubble Sort algorithm\npackage main

import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func main() {
    arr := []int{64, 34, 25, 12, 22, 11, 90}
    fmt.Println("Unsorted array:", arr)
    bubbleSort(arr)
    fmt.Println("Sorted array:", arr)
}`
  },
  {
    name: 'Reverse a String',
    code: `// Reverse a string and print the result\npackage main

import "fmt"

func reverseString(s string) string {
    runes := []rune(s)
    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes)
}

func main() {
    str := "Hello, Go!"
    fmt.Println("Original string:", str)
    fmt.Println("Reversed string:", reverseString(str))
}`
  },
  {
    name: 'Sum of Array',
    code: `// Calculate the sum of all elements in an array\npackage main

import "fmt"

func sumArray(arr []int) int {
    sum := 0
    for _, v := range arr {
        sum += v
    }
    return sum
}

func main() {
    arr := []int{1, 2, 3, 4, 5}
    fmt.Println("Array:", arr)
    fmt.Println("Sum of array:", sumArray(arr))
}`
  }
]

function onExampleChange() {
  const ex = examples.find(e => e.name === selectedExample.value)
  if (ex) {
    store.code = ex.code
    runCode()
  }
}

function copyCode() {
  navigator.clipboard.writeText(store.code)
  toast.value.showToast('Code Copied')
}

async function runCode() {
  await store.runCode()
}

onMounted(() => {
  // Initialize with first example
  selectedExample.value = examples[0].name
  store.code = examples[0].code
  
  // Set dark mode on initial load
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<style>

/* Apply a custom scrollbar style */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6; /* gray-100 */
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
}

::-webkit-scrollbar-thumb {
  background: #9ca3af; /* gray-400 */
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563; /* gray-600 */
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* gray-500 */
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* gray-500 */
}
</style>