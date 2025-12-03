# Fullstackopen

This is for the exams of the univertity course

https://fullstackopen-2019.github.io/

frequently used command

```bash
npm create vite@latest #create a react program
npm install
npm run dev #start the program
npm install json-server --save-dev
npm install axios #install requiry
npx json-server --port 3001 db.json #start json server
npm run server

```
then make some change in package.json
```json
{
  // ...
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",

    "server": "json-server -p 3001 db.json" #number after -p is used to place the port
  },
}
```
start a beckend project
```bash
npm init
npm install express
```
setup a package.json
```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```
define a custom npm script in the package.json file to start the development server
```json
{
  // ..
  "scripts": {
    "start": "node index.js",

    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```
start the server in development mode with the command
```bash
npm run dev
```
Deploy on Fly.io
## linux
```bash
curl -L https://fly.io/install.sh | sh
```
## windows
```bash
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

```bash
fly auth login
fly launch --no-deploy
fly deploy
##sometimes we meet with some network error,we can use the command
#fly deploy --depot=false
fly apps open
```
## Note for linux user
im using zsh in arch,so there might be an error
:zsh: command not found:
to solve it
```bash
nano ~/.zshrc
```
add those to the end of the file
```shell
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```
```bash
source ~/.zshrc
```
## Note for Windows users
Note that the standard shell commands in build:ui do not natively work in Windows. Powershell in Windows works differently, in which case the script could be written as
```bash
"build:ui": "@powershell Remove-Item -Recurse -Force dist && cd ../frontend && npm run build && @powershell Copy-Item dist -Recurse ../backend",
```

modify  vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
```
After restarting, the React development environment will act as proxy. If the React code makes an HTTP request to a path starting with http://localhost:5173/api, the request will be forwarded to the server at http://localhost:3001. Requests to other paths will be handled normally by the development server.
we can remove references to the cors library from the backend's index.js file and remove cors from the project's dependencies:
```shell
npm remove cors
```