//const uid = 274753872;
var id = '';
var reply_time = '';
var next_flag = true;
var arr = [];
while (next_flag && reply_time > 1658851200) {
	const response = await fetch(`https://api.bilibili.com/x/msgfeed/reply?id=${id}&reply_time=${reply_time}`, { credentials: 'include' });
	const { data } = await response.json();
	if (data.items) arr.push(...data.items);
	var { id, reply_time } = arr[arr.length - 1];
	next_flag = data.cursor.is_end === false;
	console.log(arr.length);
	await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
}
// fs.writeFileSync('qwq.json', JSON.stringify(arr, null, '\t'));
(async () => {
	var id = '';
	var reply_time = '';
	var next_flag = true;
	var arr = [];
	while (next_flag) {
		const response = await fetch(`https://api.bilibili.com/x/msgfeed/reply?id=${id}&reply_time=${reply_time}`, { credentials: 'include' });
		const { data } = await response.json();
		if (data.items) arr.push(...data.items);
		var { id, reply_time } = arr[arr.length - 1];
		next_flag = data.cursor.is_end === false;
		console.log(arr.length);
		await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
	}
	return arr;
})();
(async () => {
	e = document.createElement('a');
	e.href = `data:text/plain,${encodeURIComponent(JSON.stringify(arr))}`;
	e.download = 'out.json';
	e.click();
})();
(async () => {
	var id = '';
	var at_time = '';
	var next_flag = true;
	var arr = [];
	while (next_flag) {
		const response = await fetch(`https://api.bilibili.com/x/msgfeed/at?id=${id}&at_time=${at_time}`, { credentials: 'include' });
		const { data } = await response.json();
		if (data.items) arr.push(...data.items);
		var { id, at_time } = arr[arr.length - 1];
		next_flag = data.cursor.is_end === false;
		console.log(arr.length);
		await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
	}
	return arr;
})();
(async () => {
	var id = '';
	var like_time = '';
	var next_flag = true;
	var arr = [];
	while (next_flag) {
		const response = await fetch(`https://api.bilibili.com/x/msgfeed/like?id=${id}&like_time=${like_time}`, { credentials: 'include' });
		const { data } = await response.json();
		if (data?.total?.items) arr.push(...data.total.items);
		var { id, like_time } = arr[arr.length - 1];
		next_flag = data.total.cursor.is_end === false;
		console.log(arr.length);
		await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
	}
	return arr;
})();
//一键评论精选
{
	const uid = 274753872;
	let p = '';
	let next_flag = true;
	const arr = [];
	while (next_flag) {
		const response = await fetch(`//api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}&offset_dynamic_id=${p}`);
		const { data } = await response.json();
		if (data.cards) {
			arr.push(...data.cards.map(e => e.desc.dynamic_id_str));
			for (const i of data.cards) {
				let [type, oid] = [17, i.desc.dynamic_id_str];
				if (i.desc.type == 1)[type, oid] = [17, i.desc.dynamic_id_str]; //转发动态
				else if (i.desc.type == 2)[type, oid] = [11, i.desc.rid_str]; //图片动态
				else if (i.desc.type == 4)[type, oid] = [17, i.desc.dynamic_id_str]; //文字动态
				else if (i.desc.type == 8)[type, oid] = [1, i.desc.rid_str]; //视频
				else if (i.desc.type == 64)[type, oid] = [12, i.desc.rid_str]; //专栏
				else if (i.desc.type == 256)[type, oid] = [14, i.desc.rid_str]; //音频
				else if (i.desc.type == 2048)[type, oid] = [17, i.desc.dynamic_id_str]; //卡片动态
				else console.log(i.desc, i.desc.rid_str, i.desc.dynamic_id_str);
				const form = new FormData;
				form.append('oid', oid);
				form.append('type', type);
				form.append('action', '1');
				form.append('csrf', document.cookie.match(/bili_jct=(.+?);/)[1]);
				const r = await fetch('//api.bilibili.com/x/v2/reply/subject/modify', { method: 'post', credentials: 'include', body: form }).then(a => a.json());
				console.log(type, oid, r?.data?.action_toast);
				await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
			}
		}
		p = arr[arr.length - 1];
		next_flag = data.has_more;
	}
}
//添加收藏夹
for (const i of arr) {
	const form = new FormData;
	form.append('rid', i);
	form.append('type', '2');
	form.append('add_media_ids', '1655249072');
	form.append('csrf', document.cookie.match(/bili_jct=(.+?);/)[1]);
	const r = await fetch('//api.bilibili.com/x/v3/fav/resource/deal', { method: 'post', credentials: 'include', body: form }).then(a => a.json());
}