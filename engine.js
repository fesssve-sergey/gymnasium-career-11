'use strict';
function scoreTest(test,answers){
 const scores=Object.fromEntries(Object.keys(test.labels).map(k=>[k,0]));
 test.questions.forEach((q,i)=>{const a=answers[i];if(test.kind==='pair'){if(q.options[a])scores[q.options[a].key]++}else if(Number.isInteger(a)&&a>=0&&a<=4)scores[q.key]+=a});
 return scores;
}
function leaders(scores){const max=Math.max(...Object.values(scores));return Object.keys(scores).filter(k=>scores[k]===max)}
function summarize(answers){
 const scores=TESTS.map((t,i)=>scoreTest(t,answers[i]));
 const mbti=['EI','SN','TF','JP'].map(pair=>scores[3][pair[0]]===scores[3][pair[1]]?'X':scores[3][pair[0]]>scores[3][pair[1]]?pair[0]:pair[1]).join('');
 const klimov=leaders(scores[0]).map(k=>TESTS[0].labels[k]).join(' / ');
 const h=Object.keys(scores[1]).sort((a,b)=>scores[1][b]-scores[1][a]);const hThreshold=scores[1][h[1]];const hKeys=h.filter(k=>scores[1][k]>=hThreshold);
 const holland=hKeys.map(k=>TESTS[1].labels[k]).join(' / ');
 const disc=leaders(scores[2]).map(k=>TESTS[2].labels[k]).join(' / ');
 const weighted=(s,w,max)=>Object.entries(w).reduce((v,[k,x])=>v+s[k]/max*x,0);
 const ranked=DIRECTIONS.map(d=>({...d,fit:.45*weighted(scores[0],d.k,8)+.55*weighted(scores[1],d.h,20)})).sort((a,b)=>b.fit-a.fit);
 const flat=Math.max(...Object.values(scores[0]))-Math.min(...Object.values(scores[0]))<=1&&Math.max(...Object.values(scores[1]))-Math.min(...Object.values(scores[1]))<=1;
 const limit=ranked[2].fit;const candidates=ranked.filter(d=>d.fit>=limit-1e-9);const top=flat?[]:candidates;
 return {scores,mbti,klimov,holland,disc,hKeys,flat,top,short:flat?'Интересы пока не выделены: сравнить разные направления на практике':top.slice(0,4).map(d=>d.name).join('; ')+(top.length>4?' и другие близкие направления':'')};
}
if(typeof module!=='undefined')module.exports={scoreTest,leaders,summarize};
