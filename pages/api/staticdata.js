import path from 'path';
import { promises as fs } from 'fs';


export default async function handler(req, res) {

  console.log("data",req.query);

  const jsonDirectory = path.join(process.cwd(), 'json');
  const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  const parsedFile = JSON.parse(fileContents);

  let contentToSendBack = { sig : '' };
  let foundMatch = false;

  Object.keys(parsedFile).forEach( key => {
    if(key == req.query.input ){
      contentToSendBack.sig = parsedFile[key].sig;
      foundMatch=true;
    }
  })

 if(foundMatch){
   console.log("returned match");
   res.status(200).json(contentToSendBack);
 }else{
   console.log("no match found");
   res.status(401);
 }
}

