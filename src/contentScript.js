'use strict';

const API_PAPER_CLASSIFICATION = 'http://127.0.0.1:8000/';
const API_OPEN_CITATIONS = 'https://opencitations.net/index/api/v1/';
const API_ALT_METRIC = 'https://api.altmetric.com/v1/doi/';

const templateInfluentialLabel = ({ level }) =>
  level === 'high' || level === 'low'
    ? `<span style="background: ${
        level === 'high' ? 'red' : 'grey'
      }; color: white; padding: 5px; font-size: 80%; margin-right:5px;white-space: nowrap; margin: 0 5px">impact: ${level}</span>`
    : '';

const templateCitationLabel = ({ citations }) =>
  `<span style="background: grey; color: white; padding: 5px;font-size: 80%;white-space: nowrap; margin: 0 5px">citations: ${citations}</span>`;

const templateLabel = ({ label }) =>
  `<span style="background: grey; color: white; padding: 5px;font-size: 80%;white-space: nowrap; margin: 0 5px">topic: ${label
    .toLowerCase()
    .replace('_', ' ')}</span>`;

const templateAltMetric = ({ img, url }) =>
  `<a href="${url}" target="_blank"><img src="${img}" style="width:35px; margin: 0 5px"/></a>`;

const templatePlaceholder = () =>
  '<span data-id="influential-label"><img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" width="15" /></span><span data-id="label"></span><span data-id="category"></span><span data-id="citations"></span><span data-id="altmetric"></span>';

const fetchPaperData = (title) => {
  return fetch(
    `${API_PAPER_CLASSIFICATION}WHO_paper_classification/research_paper_classification_using_title_WHOcataData?title=${title}`,
    { method: 'POST' }
  )
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });
};

const fetchOpenCitations = (doi) => {
  return fetch(`${API_OPEN_CITATIONS}citation-count/${doi}`)
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });
};

const fetchAltMetricBadgeUrl = (doi) => {
  return fetch(`${API_ALT_METRIC}${doi}`)
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });
};

const getPapers = () =>
  [...document.querySelectorAll('.titleArt')].map((paper) => ({
    element: paper,
    title: paper.innerText,
  }));

const addLabel = ({ template, appendTo }) => {
  appendTo.innerHTML = template;
};

const displayImpactLabels = () => {
  for (const { element, title } of getPapers()) {
    const badgesPlaceholder = document.createElement('span');
    badgesPlaceholder.innerHTML = templatePlaceholder();
    element.append(badgesPlaceholder);

    fetchPaperData(title).then((paperData) => {
      fetchOpenCitations(paperData.DOI).then((openCitations) => {
        addLabel({
          template: templateCitationLabel({
            citations: openCitations[0].count,
          }),
          appendTo: element.querySelector('[data-id="citations"]'),
        });
      });
      fetchAltMetricBadgeUrl(paperData.DOI).then((data) => {
        addLabel({
          template: templateAltMetric({
            img: data.images.small,
            url: data.details_url,
          }),
          appendTo: element.querySelector('[data-id="altmetric"]'),
        });
      });
      addLabel({
        template: templateInfluentialLabel({
          level: paperData['Influential Level'],
        }),
        appendTo: element.querySelector('[data-id="influential-label"]'),
      });
      addLabel({
        template: templateLabel({
          label: paperData.Label,
        }),
        appendTo: element.querySelector('[data-id="label"]'),
      });
    });
  }
};

console.log('Starting the widget...');
displayImpactLabels();
