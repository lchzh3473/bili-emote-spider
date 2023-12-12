import fs from 'fs';
const infinityFetch = async (...arg) => {
  try {
    return await fetch(...arg);
  } catch {
    return await infinityFetch(...arg);
  }
};
const em_path = 'meta';
async function getEmote(id) {
  const response = await infinityFetch(`https://api.bilibili.com/x/emote/package?business=reply&ids=${id}`);
  const { data } = await response.json();
  return data;
}
for (let i = 0; i < 6000; i++) {
  console.log(i);
  await new Promise(resolve => setTimeout(resolve, 500)); //sleep 0.5s
  const data = await getEmote(i);
  if (!data?.packages) continue;
  fs.writeFileSync(`${em_path}/${i}.json`, JSON.stringify(await getEmote(i), null, '\t'));
}
// console.log(await getEmote(1));
// fs.writeFileSync('qwq.json', JSON.stringify(arr, null, '\t'));