"use strict";

const url = "portfolio_sites_web.json";
const xhr = new XMLHttpRequest();
const debug = false;

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
            const a_tag_open =
                responseJSON[i].validLink === false
                    ? `<a class="valid-link" title="Ce site n’est plus en ligne ou a changé de webmaster.">`
                    : `<a href="${responseJSON[i].url}" target="_blank" title="${responseJSON[i].name}">`;
            const htmlElem = `
        <div class="siteweb-out
                    col-md-6
                    col-sm-6 col-sm-offset-0
                    col-xs-10 col-xs-offset-1
                    text-center">
          <div class="row">
            ${a_tag_open}
              <div class="siteweb-in col-xs-10 col-xs-offset-1">
                <div class="siteweb-figure
                            z-depth-4">
                  <img alt="${responseJSON[i].name}" src="images/sites_web/${responseJSON[i].image}" class="img-responsive" />
                </div>
              </div>
            </a>
          </div>
        </div>`;
            htmlElems += htmlElem;
        }
        htmlTarget.innerHTML = htmlElems;
    } catch (err) {
        htmlTarget.innerHTML = "ERREUR displayJSONinHTML";
    }
}
