const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync('./Russell3000USMembershiplist.pdf');

//we set up this render_page function to insert space between the company name and its associated symbol/ticker
function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
      normalizeWhitespace: false,
      disableCombineTextItems: false
  }

  return pageData.getTextContent(render_options)
    .then(function(textContent) {
      let lastY, text = '';
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY){
          text += ' ' + item.str; //this whitespace is super important - makes it trivially easy to split company name from symbol later
        }  
        else{
          text += '\n' + item.str;
        }    
        lastY = item.transform[5];
      }
      return text;
    });
}

//here we pass our custom render_page function to our pdf parser
let options = {
  pagerender: render_page
}
pdf(dataBuffer, options).then(function(data) {

  let parsedText = data.text;

  //split by line
  parsedText = parsedText.split('\n');

  //trim all leading and ending whitespace
  parsedText = parsedText.map(e => e.trim());

  //remove all empty string
  parsedText = parsedText.filter(e => e.length != 0);

  //remove all instances of the standalone string 'ticker'
  parsedText = parsedText.filter(e => e.toLowerCase() != 'ticker');

  //remove all instances of the standalone string 'company'
  parsedText = parsedText.filter(e => e.toLowerCase() != 'company');

  //remove any string that starts with 'russell'
  parsedText = parsedText.filter(e => !e.toLowerCase().includes('russell'));

  //remove any string that includes 'membership list'
  parsedText = parsedText.filter(e => !e.toLowerCase().includes('membership list'));

  //remove all dates, which conveniently contain lowercase letters, while company names and symbols/tickers are entirely uppercase
  parsedText = parsedText.filter(e => e.toUpperCase() == e)

  //begin parsing into JSON
  let symbols = {};

  /**
   * forEach line in the parsedText array
   * we split by whitespace
   * then pop the final element of the array, which is the symbol/ticker, and save it as the key
   * then rejoin our split line into a string and store it as the value
   */
  parsedText.forEach(e => {
    let splitLineArray = e.split(' ');
    let key = splitLineArray.pop();
    let value = splitLineArray.join(' ')
    symbols[key] = value;
  });

  //stringify our Object as JSON so we can write it to filesystem
  symbols = JSON.stringify(symbols);

  //write our JSON to filesystem
  fs.writeFileSync('symbols.json', symbols);

});

