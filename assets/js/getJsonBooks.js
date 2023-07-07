"use strict";

let url = "portfolio_livres.json";
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
            const a_tag_open =
                responseJSON[i].availability === "https://schema.org/out-of-stock"
                    ? `<a class="out-of-stock" title="Cet ouvrage n’est plus disponible.">`
                    : `<a href="${responseJSON[i].url}" target="_blank" title="voir\n${responseJSON[i].name}\nsur\n${responseJSON[i].url}">`;
            const htmlElem = `
        <div class="livre-out
                    text-center
                    col-md-3
                    col-sm-4 col-sm-offset-0
                    col-xs-6 col-xs-offset-0">
          <div class="row">
            ${a_tag_open}
              <div class="livre-figure
                          z-depth-4">
                <img alt="${responseJSON[i].name}" src="images/livres/${responseJSON[i].image}" class="img-responsive" />
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
