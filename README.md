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