import fs from 'fs';
const tid = '722842317482885136';
//输出fetch到文件
fetch(`https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${tid}`, {
	headers: {
		referer: `https://t.bilibili.com/${tid}`,
	}
}).then(a => a.json()).then(a => fs.writeFileSync(`dynamic/${tid}.json`, JSON.stringify(a.data, null, '\t')));