import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';const login=await fetch(base+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});const cookie=login.headers.get('set-cookie').split(';')[0];
async function api(method='GET',data){const r=await fetch(base+'/api/records',{method,headers:{Cookie:cookie,Origin:base,'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});const body=await r.json();return {status:r.status,body};}
const ids=[];
try{
 for(const platform of ['Instagram','TikTok']){
 const result=await api('POST',{kind:'content',clientId:'batavia',data:{month:'2099-01',title:'QA calendar '+platform,type:'Reels',platform,status:'Terbit',due:'2099-01-04',publishDate:'2099-01-05',publishTime:'18:30',pillar:'QA pillar',caption:'QA caption',canvaUrl:'https://www.canva.com/design/qa',videoUrl:'https://example.com/qa.mp4',driveUrl:'https://drive.google.com/file/d/qa',url:'https://example.com/post',views:1000,reach:600,likes:30,comments:4,shares:3,saves:2,followersGained:5,measuredAt:'2099-01-07',performanceNotes:'QA insight'}});assert.equal(result.status,200);ids.push(result.body.id);
 }
 const report={kind:'contentReport',clientId:'batavia',data:{month:'2099-01',platform:'Instagram',followersStart:1000,followersEnd:1050,measuredAt:'2099-01-31',summary:'QA monthly summary',learnings:'QA learning',nextActions:'QA next steps'}};
 let r=await api('POST',report);assert.equal(r.status,200);ids.push(r.body.id);assert.equal((await api('POST',report)).status,400);
 let rows=(await api()).body.rows;const content=rows.filter(r=>ids.includes(r.id)&&r.kind==='content');assert.equal(content.length,2);assert.deepEqual(content.map(r=>r.data.platform).sort(),['Instagram','TikTok']);assert.equal(content[0].data.reach,600);assert.equal(content[0].data.publishTime,'18:30');assert.equal(content[0].data.followersGained,5);assert.ok(content[0].data.canvaUrl);assert.ok(content[0].data.driveUrl);
 const ig=content.find(r=>r.data.platform==='Instagram');assert.equal((await api('POST',{id:ig.id,version:ig.version,kind:'content',clientId:'batavia',data:{...ig.data,title:'QA edit keeps performance'}})).status,200);
 rows=(await api()).body.rows;assert.equal(rows.find(r=>r.id===ig.id).data.reach,600);console.log('PASS: both channels same date, content assets/metrics persistence, content edits keep metrics, monthly follower narrative, duplicate report protection.');
}finally{const rows=(await api()).body.rows;for(const id of ids){const row=rows.find(r=>r.id===id);if(row)assert.equal((await api('DELETE',{id,version:row.version})).status,200);}}
