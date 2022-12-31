import fs from 'fs';
import { createHash } from 'crypto';
const files = fs.readdirSync('rename');
const meta = files.map(name => {
	try {
		// const [id, text, ext] = name.match(/(\d+)(.+?)(?:_old)?\.(.+)/).slice(1);
		// const data = fs.readFileSync(`rename/${name}`);
		// const sha1 = createHash('sha1').update(data).digest('hex');
		// const renamed = `${id.padStart(5, '0')}.${text}.${sha1.slice(0, 8)}.${ext}`;
		const [id, text, ext1, str2, ext] = name.match(/(\d+)\.(.+?)\.(.+?)\.(.+?)\.(.+)/).slice(1);
		const renamed =`${id}.${text}.${str2}.${ext1}.${ext}`;
		fs.renameSync(`rename/${name}`, `rename/${renamed}`);
		// console.log(renamed);
		// return renamed;
	} catch (e) {
		console.log(e);
	}
});