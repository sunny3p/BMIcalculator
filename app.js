/***
 * A simple Node JS Server To Calculate BMI 
 * Take height and weight as operand
 * Example:
 * http://localhost:8000/calculateBMI
 * The server responds with
 * Hi Sunny. You are 25. years old. Your calculated BMI is: 20.959183673469386. You are normal. 
 * To run simply node ./app.js
 * Also you can use another npm package which is nodemon.
 * To know more about please click on this link https://www.npmjs.com/package/nodemon
 * nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
 * To install nodemon
 * npm install -g nodemon
 * nodemon [your node app]
 * */
let http = require('http');
var fs = require('fs');
let urlParse = require('url');
const {
    parse
} = require('querystring');
/**
 * Lines 9–11 import our dependency modules from the Node core package.
1. http: To create a http based server/client. In this case we would be using it to create a server.
2. fs: FileSystem module to help us with file/folders related operations
3. url: Uniform Resource Locator module to help us with URL related operations
 * Lines 12-14 npm package ‘querystring’- Parse and stringify URL query strings
 * a query string is the part of a uniform resource locator which assigns values to specified parameters. 
* you have to install an external package called ‘querystring’ using the npm command:
    npm init
    npm install querystring --save
    Option –save will an entry to the list of dependencies in the package.json file
 */
http.createServer(function (request, response) {
    let filePath = './index.html';
    const {
        method,
        url
    } = request; // get the URL and method from the request
    // const {url} = request;  <==> const url=request.url;
    //const {method}=request <==> const method=request.method;
    console.log(url, method); // print them out
    let q = urlParse.parse(url, true).query; // lets parse the query part of the URL
    let pathName = urlParse.parse(url, true).pathname; // Now we need to get the path name. i.e. /calculateBMI ...
    if (pathName === '/') // if homepage: http://localhost:8000
    {
        fs.readFile(filePath, function (error, content) { // send the home page back to the user
            // use the fs package to read the file index.html from the local drive
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        });
    } else if (pathName === '/calculateBMI') {
        console.log('We got post');
        
        if (request.method === 'POST') {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                let items = parse(body); // convert the data into an object. i.e. {height=178,weight=60}
                let calculatedBMI = 0;
               /****  
                * Metric BMI Formulae: - BMI= (weight in Kilograms/ (height in meters*height in meters))
                * Less than 18.5 is represents underweight
                * mid 18.5 -24.9 indicate normal weight
                * Between 25 -29.9 denotes over weigh
                * Beyond 30 signifies obesity
                * */
               /**
                * Using Math.round(num * 100) / 100 function to show BMI value upto 2 decimal.
               */

                calculatedBMI = Math.round((items.weight * 10000 / (items.height * items.height)) * 100)/100
                if(calculatedBMI < 18.5){
                    response.write('Hi ' + items.name +'. You are '+ items.age +'. years old. Your calculated BMI is: '+ calculatedBMI + '. You are underweight.');
                    console.log('Your result is: ' + calculatedBMI);
                }
                else if(calculatedBMI >=18.5 || calculatedBMI <= 24.9){
                    response.write('Hi ' + items.name +'. You are '+ items.age +'. years old. Your calculated BMI is: '+ calculatedBMI + '. You are normal.');
                    console.log('Your result is: ' + calculatedBMI);
                }
                else if(calculatedBMI >= 25 || calculatedBMI <= 29.9){
                    response.write('Hi ' + items.name +'. You are '+ items.age +'. years old. Your calculated BMI is: '+ calculatedBMI + '. You are over weight.');
                    console.log('Your result is: ' + calculatedBMI);
                }
                else if(calculatedBMI >= 30){
                    response.write('Hi ' + items.name +'. You are '+ items.age +'. years old. Your calculated BMI is: '+ calculatedBMI + '. You weigh much more which signifies.');
                    console.log('Your result is: ' + calculatedBMI);
                }
                response.end();
            });
        }
    } else {
        console.log('We got Error');
        response.writeHead(404); // 404 status code means Not Found;The requested resource could not be found but may be available in the future. https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        response.write('Request not Found');
        response.end();
    }
}).listen(8000); // Setting to default port 8000
