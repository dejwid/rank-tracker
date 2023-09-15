const axios = require('axios');

export async function doGoogleSearch(keyword) {
  const data = {'country': 'us','query':{'q':keyword,num:100},num:100};
  const url = 'https://api.brightdata.com/serp/req?customer=hl_57784e4b&zone=ranktracker';
  const headers = {'Authorization': 'Bearer da2a6a39-da1c-4a24-8640-809f1cf26844'};
  const response = await axios.post(url, data, {headers});
  console.log(keyword);
  if (!response?.headers) {
    console.error('no header in response '+url);
    console.error(data);
    return null;
  } else {
    console.log('responseId:'+response?.headers.get('x-response-id'));
    return response?.headers.get('x-response-id');
  }
}
