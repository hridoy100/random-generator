import express from 'express'
import path from 'path';
const __dirname = path.resolve();
import fs from 'fs';
const app = express()

const port = process.env.PORT || 3000

/*
ASCII values: a-z = 97 - 97+25
              A-Z = 65 - 65+25

*/

function randomInt(len){
  // console.log(len);
  var intVal = 0, i=0, min=0, max=10;
  var sign = (Math.random()*10<<0)%2===0?1:-1;
  let intLen = len==0?(Math.random() * (max - min) + min << 0):len;
  intVal=Math.random()*Math.pow(10, intLen) << 0;
  intVal*=sign;
  // console.log(" "+intVal.toString().length);
  return intVal;
}

function randomRealNum(len){
  // console.log(len);
  len = len==0?(Math.random()*10)<<0:len-2;
  var val = Math.random()*Math.pow(10, len);
  var fixedDecimalPoint = (Math.random()*5)<<0;
  val = val.toFixed(len==0?fixedDecimalPoint:2);
  // console.log(" "+val.toString().length);
  return val;
}

function getRandomChar(){
  // 97 = 'a', 97+25='z'
  var minChar=97, maxChar=97+25;
  return Math.random() * (maxChar - minChar) + minChar << 0;
}

function getRandomInt(){
  // 48 = '0', 57='9'
  var minNum=48, maxNum=57
  return Math.random() * (maxNum - minNum) + minNum << 0;
}

function randomString(an, len){
  var str = "", i=0, min=5, max=20;
  // console.log(len);
  let strLen = len==0?(Math.random() * (max - min) + min << 0) : len;
  let charVal, numVal;
  for(; i++<strLen; ){
    charVal = getRandomChar();
    if(an==="an") {
      // console.log("an")
      numVal = getRandomInt();
      let takeCharOrNum = (Math.random()*10<<0)%2;
      str += String.fromCharCode(takeCharOrNum === 0 ? charVal : numVal);
    }
    else if(an===" "){
      // console.log("string:")
      str += String.fromCharCode(charVal);
    }
  }
  // console.log(" "+str.length);
  return str;

}

function generate(len) {
  var str, num, data = "", curLen = 0;
  // console.log("len: " +len);
  if (len != 0) {
    curLen = (len / 4) << 0;
    curLen -= 2;
    console.log("curLen: " + curLen);
  }

  // console.log("len: " +len);

  str = randomString(" ", curLen);
  data += str;
  data += ", "
  // console.log("str: " + str + " len="+str.length);
  num = randomRealNum(curLen);
  data += num;
  data += ", "
  // console.log("Rnum: " + num + " len="+num.length);
  num = randomInt(curLen);
  data += num;

  data += ", "
  // console.log("num: " + num + " len="+num.toString().length);
  if (len === 0)
    str = randomString("an", len);
  else {
    str = randomString("an", len - data.length);
  }

  data+=str;
  if(len===0) {
    data += ", ";
  }
  // console.log("data: " + data);
  return data;
}


function generate2MBData(fileName){
  var maxChars = 2048000, calc=0;
  var data ="";
  fs.writeFile(fileName, "", (err) => {
    if(err) throw err;
  });
  var out = fs.createWriteStream(fileName, { flags : 'a' });
  while (calc<maxChars) {
    // console.log(calc);
    if((maxChars-calc)<20*2+10*2+6+10 && (maxChars-calc)>11){
      // console.log("inside: generate with len");
      // console.log((maxChars-calc));
      data = generate(maxChars-calc);
    }
    else if ((maxChars-calc)<=11){
      data="";
      calc=maxChars;
      continue;
    }
    else {
      data = generate(0);
    }
    // console.log("len: " + data.length);
    /*fs.appendFileSync(fileName, data,(err) => {
      // In case of a error throw err.
      if (err) {
        console.log(err);
        throw err;
      }
    })*/
    out.write(data, 'utf-8');
    // fs.close("output.txt", (err) => {
    //   if (err)
    //     console.error('Failed to close file', err);
    //   else {
    //     console.log("\n> File Closed successfully");
    //   }
    // });
    calc+=data.length;
  }
  out.end();
}

function calculateObjects(fileName){
  var data="";
  try {
    data = fs.readFileSync(fileName, 'utf8')
    // console.log(data)
  } catch (err) {
    console.error(err)
  }
  var dataArr = data.split(", ");
  var strCount=0, realCount=0, intCount=0, alphaCount=0, i=0;
  // var reString = new RegExp("^[a-z]+$");
  var reString = new RegExp("^[a-z]+$");
  var reAlpha = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-z0-9]+$");
  var reReal = new RegExp("^[0-9]*\\.[0-9]+$");
  var reInt = new RegExp("^(-?[0-9]+)$")

  for(; i++<dataArr.length;){
    var val = dataArr[i];
    if(reAlpha.test(val)){
      alphaCount++;
    }
    else if(reString.test(val)){
      strCount++;
    }
    else if(reReal.test(val)){
      realCount++;
    }
    else if(reInt.test(val)){
      intCount++;
    }
  }
  // console.log("alphaCount="+alphaCount);
  // console.log("strCount="+strCount);
  // console.log("realCount="+realCount);
  // console.log("intCount="+intCount);
  var obj = {
    alpha: alphaCount,
    str: strCount,
    int: intCount,
    real: realCount
  }

  return obj;
}

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});



app.get('/download', (req, res) => {
  res.download(__dirname+"/output.txt");
});

app.get('/report', (req, res) => {
  var obj = calculateObjects(__dirname + "/output.txt");
  res.send(JSON.stringify(obj));
});

app.get('/generate', (req, res) => {
  // console.log("generate called");
  var fileName = "output.txt";
  generate2MBData(fileName);
  var obj={
    fileName: "output.txt",
    url: "http://localhost:3000/download",
  }
  // console.log("generation ended");
  res.send(JSON.stringify(obj));
})

app.listen(port, ()=> {
  console.log(`Server is listening on port ${port}..`)
})