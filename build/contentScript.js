(()=>{"use strict";const e=({level:e})=>"high"===e||"low"===e?`<span style="background: ${"high"===e?"red":"grey"}; color: white; padding: 5px; font-size: 80%; margin-right:5px;white-space: nowrap; margin: 0 5px">impact: ${e}</span>`:"",t=({citations:e})=>`<span style="background: grey; color: white; padding: 5px;font-size: 80%;white-space: nowrap; margin: 0 5px">citations: ${e}</span>`,a=({label:e})=>`<span style="background: grey; color: white; padding: 5px;font-size: 80%;white-space: nowrap; margin: 0 5px">topic: ${e.toLowerCase().replace("_"," ")}</span>`,n=({img:e,url:t})=>`<a href="${t}" target="_blank"><img src="${e}" style="width:35px; margin: 0 5px"/></a>`,i=e=>fetch(`http://127.0.0.1:8000/WHO_paper_classification/research_paper_classification_using_title_UncataData?title=${e}&UploadPdf=False`,{method:"POST"}).then((e=>e.json())).catch((e=>{console.log(e)})),l=e=>fetch(`https://api.altmetric.com/v1/doi/${e}`).then((e=>e.json())).catch((e=>{console.log(e)})),o=({template:e,appendTo:t})=>{t.innerHTML=e};console.log("Starting the widget..."),(()=>{for(const{element:p,title:s}of[...document.querySelectorAll(".titleArt")].map((e=>({element:e,title:e.innerText})))){const c=document.createElement("span");c.innerHTML='<span data-id="influential-label"><img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" width="15" /></span><span data-id="label"></span><span data-id="category"></span><span data-id="citations"></span><span data-id="altmetric"></span>',p.append(c),i(s).then((i=>{var s;(s=i.DOI,fetch(`https://opencitations.net/index/api/v1/citation-count/${s}`).then((e=>e.json())).catch((e=>{console.log(e)}))).then((e=>{o({template:t({citations:e[0].count}),appendTo:p.querySelector('[data-id="citations"]')})})),l(i.DOI).then((e=>{o({template:n({img:e.images.small,url:e.details_url}),appendTo:p.querySelector('[data-id="altmetric"]')})})),o({template:e({level:i["Influential Level"]}),appendTo:p.querySelector('[data-id="influential-label"]')}),o({template:a({label:i.Label}),appendTo:p.querySelector('[data-id="label"]')})}))}})()})();