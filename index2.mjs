import fs from 'fs';
const dateFormater = new Intl.DateTimeFormat('zh-CN', {
	timeZone: 'Asia/Shanghai',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
});
const tid = '687383861901918226';
const comment_type = 11;
const comment_id_str = '201794993';
let dataText = `2022/07/27 08:41:08 lchzh3473(274753872) 转发10 评论52 点赞280 

【正文】
模拟器开发进度因设备兼容问题陷入停滞[tv_大哭]\n-\n半死不活的lchzh突然开始找我要零花钱（划掉

【图片】
https://i0.hdslb.com/bfs/new_dyn/f55eddde61b4df7bbaaa8db0ebe7554a274753872.jpg
`;
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
		if (data.replies && data.replies.length > 0) {
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
		if (data.replies && data.replies.length > 0) {
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
	const { rpid, ctime, rcount, like, member, content } = reply;
	let comment = '';
	const floor = await fetch(`https://api.bilibili.com/x/v2/reply/detail?type=${comment_type}&oid=${comment_id_str}&root=${rpid}`);
	const { data: { root: { floor: floorNum } } } = await floor.json();
	const localeString = dateFormater.format(new Date(ctime * 1000));
	comment += `${'#'.repeat(count)}${floorNum} ${localeString} ${member.uname}(${member.mid}) 点赞${like} 回复${rcount}\n`;
	comment += `${content.message}\n\n`;
	console.log(floorNum);
	return comment;
}