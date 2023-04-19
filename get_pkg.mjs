import fs from 'fs';
const em_path = 'meta';
async function getEmote(id) {
	const response = await fetch(`https://api.bilibili.com/x/emote/package?business=reply&ids=${id}`);
	const { data } = await response.json();
	return data;
}
for (let i = 0; i < 2000; i++) {
	console.log(i);
	await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
	const data = await getEmote(i);
	if (!data?.packages) continue;
	fs.writeFileSync(`${em_path}/${i}.json`, JSON.stringify(await getEmote(i), null, '\t'));
}
// console.log(await getEmote(1));
// fs.writeFileSync('qwq.json', JSON.stringify(arr, null, '\t'));