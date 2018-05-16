### A Single Page Blog [![Build Status](https://travis-ci.org/tosone/single-blog.svg?branch=master)](https://travis-ci.org/tosone/single-blog)

Write blog with markdown.

- `npm install` install all dependencies packages.
- Website's configurations are all in the `config.json`.
- `npm run build` generate `database.json` which is the website's database.
- After that. You can write blog in `gh-pages/data` which is default with markdown, and your blog no matter how deep it is in that directory is avaliable.
- And the artical's name is in the same dirsctory with the same name which Extname can be set in `config.js`.
- Now, after you write a new blog in `gh-pages/data`, you can run `node init.js` and deploy it by yourself. Or, you can run `node server` in `gh-pages/data`, then you can see it in http://127.0.0.1:3000 which is default.
