import fs from 'fs';
const uid = 274753872;
let p = '';
let next_flag = true;
const arr = [];
while (next_flag) {
	const response = await fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}&offset_dynamic_id=${p}`);
	const { data } = await response.json();
	if (data.cards) arr.push(...data.cards.map(e => e.desc.dynamic_id_str));
	p = arr[arr.length - 1];
	next_flag = data.has_more;
	console.log(arr.length);
	await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
}
fs.writeFileSync('qwq.json', JSON.stringify(arr, null, '\t'));