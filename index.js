const { v4: uuidv4 } = require('uuid');

function tsvJSON(tsv) {
    const lines = tsv.split("\n");
    const result = [];
    const headers = lines[0].split("\t");

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split("\t");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    return result;
}

function headerRename(ih, oh, elem, conv) {
    if (conv == null) {
        elem[oh] = elem[ih]
    }
    else {
        elem[oh] = conv(elem[ih])
    }

    delete elem[ih]
    return elem
}

function getTwentyFourHourTime(amPmString) {
    var d = new Date("1/1/2013 " + amPmString);
    var min = ""
    if (d.getMinutes() == 0) {
        min = "00"
    } else {
        min = d.getMinutes()
    }
    return d.getHours() + ':' + min;
}

function standardizeTimes(timeText) {
    let up = timeText.toUpperCase()
    if (up.indexOf("PM") != -1 || up.indexOf("AM") != -1) {
        return getTwentyFourHourTime(timeText)
    } else {
        return timeText
    }
}
function addAddtionalProperties(elem) {
    elem["border"] = "1px transparent"
    elem["backgroundColor"] = "transparent"
    elem["id"] = uuidv4()
    return elem
 }

function fixFormatting(i) {
    return i.map(elem => {
        //   elem["start_time"] = elem["Start Time"]
        //   delete elem["Start Time"]
        let replacements = [
            ["Start Time", "start_time", (e => standardizeTimes(e))],
            ["End TIme", "end_time", (e => standardizeTimes(e))],
            ["Main text", "event_name"],
            ["Sub text", "event_description"]
        ]
        replacements.forEach(r => headerRename(r[0], r[1], elem, r[2]))


        return addAddtionalProperties(elem)
    }
    )
}

const { readFileSync, writeFileSync } = require('fs');
const tsvFileData = readFileSync('./j.tsv');
const jsonRes = tsvJSON(tsvFileData.toString());

// Remove empty entries
let result = fixFormatting(jsonRes).filter( i => i["event_name"] != "" )
// null, 4 formats it with 4 spaces, remove for minified
let resultString = JSON.stringify(result, null, 4)
console.log(resultString)
// console.log("Original size", result.length)
// console.log("Filtered size", result.filter( i => i["event_name"] != "" ).length)
// console.log(result.filter( i => i["event_name"] == "" ))
writeFileSync('schedule.json', resultString, 'utf8');