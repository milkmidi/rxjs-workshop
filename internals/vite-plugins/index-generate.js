import ejs from 'ejs';
import { promises as fs } from 'fs';
// import path from 'path';
import glob from 'glob';

export default function IndexGeneratePlugin(options) {
  const { template } = options;
  return {
    name: 'index-generate-plugin',
    apply: 'build',
    async writeBundle() {
      const inputs = glob.sync(`./src/*.html`).map((fileName) => {
        return fileName.replace('./src/', '');
      });
      const templateStr = await fs.readFile(template, 'utf-8');
      const data = {
        inputs,
        user: {
          name: 'name',
        },
      };
      const renderResult = ejs.render(templateStr, data, {});
      // const srcFolder = await fs.readdir(root);
      // console.log(renderResult);
      await fs.writeFile('./src/index.html', renderResult);
    },
  };
}
