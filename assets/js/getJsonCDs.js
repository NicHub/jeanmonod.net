"use strict";

let url = "cds.json";
let xhr = new XMLHttpRequest();
let debug = true;

main();

function main() {
    xhr.open("GET", url);
    xhr.send(null);

    xhr.addEventListener("load", displayJSONinHTML);
    xhr.addEventListener("error", xhrDisplayStatus);
}

function xhrDisplayStatus() {
    if (debug || xhr.status !== 200)
        console.log("Code de réponse HTTP = " + xhr.status);
}

function displayJSONInConsole(responseJSON) {
    if (!debug) return;
    console.log(xhr.responseText);
    const JSONstringifyResponseJSON = JSON.stringify(responseJSON);
    console.log("JSONstringifyResponseJSON = " + JSONstringifyResponseJSON);
    for (let item in responseJSON) {
        console.log(item);
        console.log(responseJSON[item]);
    }
}

function displayJSONinHTML() {
    xhrDisplayStatus();
    const responseJSON = JSON.parse(xhr.responseText);
    displayJSONInConsole(responseJSON);
    const htmlTarget = document.getElementById("htmlTargetID");
    let htmlElems = "";
    try {
        for (let i = 0; i < responseJSON.length; i++) {
            const htmlElem = `
        <div class="cd-out
                    text-center
                    col-md-3
                    col-sm-4 col-sm-offset-0
                    col-xs-12 col-xs-offset-0">
          <div class="row">

              <div class="cd-figure
                          z-depth-4">
                <img alt="${responseJSON[i].image}" src="images/cd/images/${responseJSON[i].image}" class="img-responsive" />
                <div class="overlay">${responseJSON[i].image.split('.')[0]}</div>
              </div>

          </div>
        </div>`;
            htmlElems += htmlElem;
        }
        htmlTarget.innerHTML = htmlElems;
    } catch (err) {
        htmlTarget.innerHTML = "ERREUR displayJSONinHTML";
    }
}
