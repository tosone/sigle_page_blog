### A Single Page Blog

Write blog with markdown.

- `npm install` install all dependencies packages.
- Website's configurations are all in the `config.json`.
- `npm run build` generate `database.json` which is the website's database.
- `npm run release` generate `dist`.
- `npm run release` is a simple server.
- After that. You can write blog in `dist/data` which is default with markdown, and your blog no matter how deep it is in that directory is avaliable.
- And the artical's name is in the same dirsctory with the same name which Extname can be set in `config.js`.
- Now, after you write a new blog in `dist/data`, you can run `node init.js` and deploy it by yourself. Or, you can run `node server` in `dist/data`, then you can see it in http://127.0.0.1:3000 which is default.
