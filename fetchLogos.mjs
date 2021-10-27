import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import fetch from 'node-fetch';

//read in our JSON file and de-stringify our JSON file
let symbols = JSON.parse(fs.readFileSync('./symbols.json'));

//retrieve our symbols/tickers from the JSON
const keys = Object.keys(symbols)

//our helpful logo resource
const resourceURI = 'https://g.foolcdn.com/art/companylogos/mark/'

const streamPipeline = promisify(pipeline);

//make a request, get data, set a timeout, and save data while waiting
let counter = 1;

let timeOut = 500;

keys.forEach(key => {

  setTimeout(async () => {
    try{

      const increment = counter;

      //construct our url
      let url = `${resourceURI}${key}.png`;

      console.log(`${increment}: Attemping to GET ${symbols[key]} logo at ${url}`);
      
      //fetch our url
      let imageRes = await fetch(url);

      //throw error if fetch fails
      if (!imageRes.ok) throw new Error(`Unexpected response ${imageRes.statusText}`);

      console.log(`Successfully retrieved ${symbols[key]} logo stream`);

      console.log(`Attempting to write ${symbols[key]} logo`);

      //convert our key string to lowercase for use in the new filename
      let lowerCaseKey = key.toLowerCase()

      //pipe our stream into fs and write to ./logos/
      await streamPipeline(imageRes.body, fs.createWriteStream(`./logos/${lowerCaseKey}.png`));

      console.log(`Successfully wrote ${symbols[key]} logo`)

    } catch (err) {

      console.log(`An error occurred: ${err}`);

    }
  }, timeOut);

  //schedule GET requests with at least one and a half seconds between reqs so we don't clobber their api 
  timeOut += Math.random() * 1000 + 1500;

  counter++;
  
});