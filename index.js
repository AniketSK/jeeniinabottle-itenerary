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
      if(conv == null) {
        elem[oh] = elem[ih]
    }
    else {
        elem[oh] = conv(elem[ih])
    }

      delete elem[ih]
      return elem
  }

  function fixHeaders(i) {
     return i.map( elem => {
        //   elem["start_time"] = elem["Start Time"]
        //   delete elem["Start Time"]
        let replacements = [
            ["Start Time", "start_time", ( e => e )],
            ["End TIme","end_time"],
            ["Main text","event_name"],
            ["Sub text","event_description"]
        ]
        replacements.forEach( r => headerRename(r[0],r[1],elem,r[2]))
          
          return elem
      }
    )
  }

  const { readFileSync } = require('fs');
  const tsvFileData = readFileSync('./j.tsv');
  const jsonRes = tsvJSON(tsvFileData.toString());
  
  console.log(JSON.stringify(fixHeaders(jsonRes)));