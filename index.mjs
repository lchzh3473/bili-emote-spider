import fs from 'fs';
const tid = '734369829330354232';
const dynamic_url = `https://t.bilibili.com/${tid}`;
const dynamic_detail_url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${tid}`;
// const dynamic_reply_url = `https://api.bilibili.com/x/v2/reply?ps=20&pn=1&type=11&oid=778902721746960423&sort=0&nohot=1&root=778902721746960423`;
// 输出fetch到文件
const raw = await fetch(dynamic_detail_url, { headers: { referer: dynamic_url } }); //不加headers会-412
const { data } = await raw.json();
const { comment_id_str, comment_type } = data.item.basic;
fs.writeFileSync(`dynamic/${tid}.json`, JSON.stringify(data, null, '\t'));
const dateFormater = new Intl.DateTimeFormat('zh-CN', {
	timeZone: 'Asia/Shanghai',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
});
let dataText = '';
const { module_author: { pub_ts, name, mid }, module_dynamic: { desc, major } } = data.item.modules;
dataText += `${dateFormater.format(new Date(pub_ts*1000))} ${name}(${mid})\n\n`;
dataText += `【正文】\n`;
dataText += `${desc.text}\n\n`;
if (major) {
	dataText += `【图片】\n`;
	for (const { src } of major.draw.items) {
		dataText += `${src}\n`;
	}
}
dataText += `\n【评论】\n`;
dataText += await getReply();
fs.writeFileSync(`dynamic/${tid}.txt`, dataText);

function writePage(data) {
	fs.writeFileSync(`dynamic/${tid}-replies-${data.page.num}.json`, JSON.stringify(data, null, '\t'));
}
async function getReply() {
	const comments = [];
	for (let i = 1; i < 1000; i++) {
		const response = await fetch(`https://api.bilibili.com/x/v2/reply?ps=20&pn=${i}&type=${comment_type}&oid=${comment_id_str}&sort=0`);
		const { data } = await response.json();
		if (data.replies) {
			writePage(data);
			for (const reply of data.replies) {
				const detail = await getDetail(reply, 1);
				const reply2 = await getReply2(reply.rpid);
				comments.unshift(detail + reply2);
			}
		} else break;
	}
	return comments.join('');
}
//
async function getReply2(rpid) {
	const comments = [];
	let comment = '';
	for (let i = 1; i < 1000; i++) {
		const response = await fetch(`https://api.bilibili.com/x/v2/reply/reply?ps=20&pn=${i}&type=${comment_type}&oid=${comment_id_str}&root=${rpid}`);
		const { data } = await response.json();
		if (data.replies) {
			for (const reply of data.replies) {
				const detail = await getDetail(reply, 2);
				comments.push(detail);
			}
			comment += comments.join('');
		} else break;
	}
	return comment;
}
async function getDetail(reply, count) {
	const { rpid, ctime, member, content } = reply;
	let comment = '';
	const floor = await fetch(`https://api.bilibili.com/x/v2/reply/detail?type=${comment_type}&oid=${comment_id_str}&root=${rpid}`);
	const { data: { root: { floor: floorNum } } } = await floor.json();
	const localeString = dateFormater.format(new Date(ctime * 1000));
	comment += `${'#'.repeat(count)}${floorNum} ${localeString} ${member.uname}(${member.mid})\n`;
	comment += `${content.message}\n\n`;
	console.log(floorNum);
	return comment;
}