import { applyI18n } from "./i18n.mjs";
import fs from "fs";
import { promisify } from "util";
import { join } from "path";
import { buildFolder, rootFolder } from "./paths.mjs";
import { getL10nData } from "./i18n.mjs";
import { productionCompiler } from "./webpackCompiler.mjs";
import fsExtra from "fs-extra";

const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rm);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const cp    = fsExtra.copy;

const handleRelativeCopy = async (from, to) => {
  const text = (await readFile(from)).toString();
  await writeFile(
    to,
    text.replace('<base href="../">', '<base href="./">'),
  );
};

const build = async () => {
  await rmdir(buildFolder, { recursive: true , force: true});
  await mkdir(buildFolder);
  console.log('Webpacking...');
  await new Promise((res)=> {
    productionCompiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(stats.toString({ colors: true }));
        process.exit(0);
      }
      res();
    });
  });
  console.log('Copying files...');
  await Promise.all([
    cp(join(rootFolder, 'index.html'), join(buildFolder, 'index.html')),
    cp(join(rootFolder, 'manifest.json'), join(buildFolder, 'manifest.json')),
    cp(join(rootFolder, 'service-worker.js'), join(buildFolder, 'service-worker.js')),
    cp(join(rootFolder, 'assets'), join(buildFolder, 'assets')),
  ]);
  console.log('Localizing...');
  const l10n = await getL10nData();
  const baseDict = l10n.find((x)=>x.code==='zh').data;
  await Promise.all(l10n.map(async (x)=>{
    await mkdir(join(buildFolder, x.code));
    const dict = { ...baseDict, ...x.data ,
    dynamicImage:`./${x.code}/assets/0.png`,bkImage:`./${x.code}/assets/bk.png` };
    await Promise.all([
      applyI18n(
        join(buildFolder, 'index.html'),
        join(buildFolder, `${x.code}/index.html`),
        dict,
      ),
      applyI18n(
        join(buildFolder, 'app.js'),
        join(buildFolder, `${x.code}/app.js`),
        dict,
      ),
      applyI18n(
        join(buildFolder, 'manifest.json'),
        join(buildFolder, `${x.code}/manifest.json`),
        dict,
      ),
      cp(
        join(buildFolder, 'app.css'),
        join(buildFolder, `${x.code}/app.css`),
      )
    ]);

    await Promise.all([
      cp(
      join(rootFolder, 'assets', '0.png'),
      join(buildFolder, x.code, 'assets','0.png')
      ),
     cp(
      join(rootFolder, 'assets', '1.png'),
      join(buildFolder, x.code, 'assets','1.png')
      ),
      cp(
      join(rootFolder, 'assets', '2.png'),
      join(buildFolder, x.code, 'assets','2.png')
      ),
      cp(
      join(rootFolder, 'assets', 'bk.png'),
      join(buildFolder, x.code, 'assets','bk.png')
      )
      ]
  )
  }));
  await Promise.all([
    handleRelativeCopy(join(buildFolder, 'zh', 'app.css'), join(buildFolder, 'app.css')),
    handleRelativeCopy(join(buildFolder, 'zh', 'manifest.json'), join(buildFolder, 'manifest.json')),
    handleRelativeCopy(join(buildFolder, 'zh', 'index.html'), join(buildFolder, 'index.html')),
    handleRelativeCopy(join(buildFolder, 'zh', 'app.js'), join(buildFolder, 'app.js')),
  ]);
  console.log('Finished successfully.');
};

build();
