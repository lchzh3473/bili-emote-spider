import fs from 'fs';
import { createHash } from 'crypto';
const infinityFetch = async (...arg) => {
  try {
    return await fetch(...arg);
  } catch {
    return await infinityFetch(...arg);
  }
};
const getTemplatedBuffer = async url => {
  const tmp_path = 'e:/archive/image-bili-emote/.tmp';
  const filename = url.split('/').pop();
  const tmp = `${tmp_path}/${filename}`;
  if (fs.existsSync(tmp)) return fs.readFileSync(tmp);
  const response = await infinityFetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(tmp, buffer);
  return buffer;
};
const em_path = 'meta';
const im_path = 'e:/archive/image-bili-emote/img';
const pk_path = 'e:/archive/image-bili-emote/pkg';
const escape = str => str.replace(/[\\\/:*?"<>|]/g, a => `%${a.charCodeAt().toString(16).toUpperCase()}`);
// for (const i of fs.readdirSync(im_path)) fs.unlinkSync(`${im_path}/${i}`); //delete
// for (const i of fs.readdirSync(pk_path)) fs.unlinkSync(`${pk_path}/${i}`); //delete
const arr = await fs.promises.readdir(em_path);
for (const e of arr) {
  const pkg = JSON.parse(fs.readFileSync(`${em_path}/${e}`))?.packages?.[0]; //
  if (pkg) {
    const { id, text, url } = pkg;
    const id_str = String(id).padStart(4, '0');
    const url_str = url.split('@')[0];
    const ext = url_str.split('.').pop();
    const buffer = await getTemplatedBuffer(url_str);
    const sha1 = createHash('sha1').update(buffer).digest('hex');
    const name = `${id_str}.${escape(text)}.${sha1.slice(0, 8)}.${ext}`;
    console.log(id, name);
    if (!fs.existsSync(`${pk_path}/${name}`)) fs.writeFileSync(`${pk_path}/${name}`, buffer);
  }
  for (const e of pkg?.emote || []) {
    const { id, text, url, gif_url, type } = e;
    const id_str = String(id).padStart(5, '0');
    if (type === 4) {
      const buffer = url;
      const sha1 = createHash('sha1').update(buffer).digest('hex');
      const name = `${id_str}.${escape(text)}.${sha1.slice(0, 8)}.txt`;
      console.log(id, name);
      if (!fs.existsSync(`${im_path}/${name}`)) fs.writeFileSync(`${im_path}/${name}`, buffer);
    } else {
      const url_splited = url.split('@')[0];
      const ext = url_splited.split('.').pop();
      const buffer = await getTemplatedBuffer(url_splited);
      const sha1 = createHash('sha1').update(buffer).digest('hex');
      const name = `${id_str}.${escape(text)}.${sha1.slice(0, 8)}.${ext}`;
      if (!fs.existsSync(`${im_path}/${name}`)) fs.writeFileSync(`${im_path}/${name}`, buffer);
    }
    if (gif_url) {
      const buffer = await getTemplatedBuffer(gif_url);
      const sha1 = createHash('sha1').update(buffer).digest('hex');
      const name = `${id_str}.${escape(text)}.${sha1.slice(0, 8)}.gif`;
      if (!fs.existsSync(`${im_path}/${name}`)) fs.writeFileSync(`${im_path}/${name}`, buffer);
    }
  }
}
