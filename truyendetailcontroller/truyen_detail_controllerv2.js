const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const TruyenDetail2 = require('../models/truyen_detailv2')
var cloudscraper = require('cloudscraper');
url='https://truyenfull.vn/danh-sach/truyen-hot/'
base_url='https://truyenfull.vn/'

const getHtmlThoughCloudflare = async (url) => {
    try {
      const html = await cloudscraper.get(url);
      return html;
    } catch (error) {
      //console.log(error);
    }

  }


const getDetail = async (url) => {
      try {
        titles=[]
        imageurls=[]
        authors=[]
        chaps=[]
        urls=[]
        const html = await getHtmlThoughCloudflare(url);
        const dom = new JSDOM(html);
        res=[]
        
        var imageurl = dom.window.document.querySelectorAll('.col-xs-3>div>div');
        //console.log(imageurl[0].getAttribute('data-image'))
        
        var title = dom.window.document.querySelectorAll('.truyen-title a');
        //console.log(tittle.length);
        var author = dom.window.document.querySelectorAll('.author');
        
        var chap= dom.window.document.querySelectorAll('.col-xs-2>div>a');
       // console.log(chap[0].textContent);
        //console.log(imageurl.length);
        //for each, get textContent
        for (let i = 0; i < title.length; i++) {
          titles.push(title[i].textContent);
          imageurls.push(imageurl[i].getAttribute('data-image'));
          authors.push(author[i].textContent);
          chaps.push(chap[i].textContent);
          urls.push(title[i].getAttribute('href'));

          truyen_detail = new TruyenDetail2(
            titles[i],
            imageurls[i],
            urls[i],
            authors[i],
            chaps[i]
          )
          const newurl=title[i].getAttribute('href')
          
          html2=await getHtmlThoughCloudflare(newurl)
          const dom2 = new JSDOM(html2);
          var description = dom2.window.document.querySelector('.desc-text');
          //console.log(description.textContent);

          res.push(truyen_detail)
        }

       
        
      } catch (error) {
        console.log(error);

      }
      return res
  }

 


  getDetail(url).then(function(result){
    //console.log(result);
  })

  module.exports = {getDetail};