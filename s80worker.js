/** XHConn - Simple XMLHTTP Interface - bfults@gmail.com - 2005-04-08        **
 ** Code licensed under Creative Commons Attribution-ShareAlike License      **
 ** http://creativecommons.org/licenses/by-sa/2.0/                           **/
function XHConn()
{
  var xmlhttp, bComplete = false;
  try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
  catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
  catch (e) { try { xmlhttp = new XMLHttpRequest(); }
  catch (e) { xmlhttp = false; }}}
  if (!xmlhttp) return null;
  this.connect = function(sURL, sMethod, sVars, fnDone)
  {
    if (!xmlhttp) return false;
    bComplete = false;
    sMethod = sMethod.toUpperCase();

    try {
      if (sMethod == "GET")
      {
        xmlhttp.open(sMethod, sURL+"?"+sVars, true);
        sVars = "";
      }
      else
      {
        xmlhttp.open(sMethod, sURL, true);
        xmlhttp.setRequestHeader("Method", "POST "+sURL+" HTTP/1.1");
        xmlhttp.setRequestHeader("Content-Type",
          "application/x-www-form-urlencoded");
      }
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && !bComplete)
        {
          bComplete = true;
          fnDone(xmlhttp);
        }};
        startTime = performance.now();
      xmlhttp.send(sVars);
    }
    catch(z) { return false; }
    return true;
  };
  return this;
}

function measureResponse(myXHR){
    if(myXHR.status == 200){
        completeTime = performance.now();
        if(completeTime - startTime<=0){
            console.log("error: Impossibly short request (likely caused by Spectre mitigation in your browser reducing timer accuracy)");
            console.log("completeTime: "+completeTime);
            console.log("startTime: "+startTime);
            postMessage(1);
        }
        else
             postMessage(Math.ceil(completeTime - startTime));
    }
    else
    {
        console.log("error; response code:")
        console.log(myXHR.status);
        setTimeout(onmessage,1000); //retry in a second
    }
}
//must be delcared outside of onmessage for performance
let xhr = new XHConn();
let url = "";
let startTime;
let completeTime;

onmessage = function(event) {
//start
 //runs when this worker is called by index.html
  
    url = "nocache=" + Math.random();

    xhr.connect("16k.jpg", "GET", url, measureResponse);


}
