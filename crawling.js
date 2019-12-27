const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

getHtml("https://www.cpubenchmark.net/high_end_cpus.html").then(html => {
  let ulList = [];
  const $ = cheerio.load(html.data);
  const $bodyList = $("div#mark ul.chartlist").children("li");

  $bodyList.each(function(i, elem) {
    ulList[i] = {
        rank: i+1,
        name: $(this).find('span.prdname').text(),
        score: Number($(this).find('span.count').text().replace(',',''))
    };
  });

  const data = ulList.filter(n => n.name);
  return data;
}).then((res) => {
  res.forEach(element => {
    console.log(element);
  });
});
