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