const csv = require('csv');
const fs = require('fs'); 
const config = require('./config.json');

function putColumns(columns) {
    let serialized = '';
    for(const col of columns) {
        serialized += `${col}, `;
    }
    return serialized.substring(0, serialized.length - 2);
}

function putValues(columns, csvrow) {
    let serialized = '';
    for(let i=0; i<columns.length; i++) {
        serialized += `'${csvrow[i]}', `;
    }
    return serialized.substring(0, serialized.length - 2);
}

function run() {
    const {inputFile, outputFile, tableName, delimiter, columns} = config;
    let queries = "";
    
    fs.createReadStream(inputFile)
    .pipe(csv.parse({delimiter}))
    .on('data', function(csvrow) {

        const row = `INSERT INTO ${tableName} (${putColumns(columns)}) VALUES(${putValues(columns, csvrow)});`;  
        queries += `${row}\n`;
        
    })
    .on('end',function() {
        fs.writeFileSync(outputFile, queries);
    });
}

run();