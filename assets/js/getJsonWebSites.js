"use strict";

var url = "portfolio_sites_web.json";
var xhr = new XMLHttpRequest();
var debug = false

main();

function main()
{
  xhr.open( "GET", url );
  xhr.send( null );

  xhr.addEventListener( "load",  displayJSONinHTML );
  xhr.addEventListener( "error", xhrDisplayStatus );
}

function xhrDisplayStatus()
{
  if( debug || xhr.status !== 200 )
    console.log( "Code de réponse HTTP = " + xhr.status );
}

function displayJSONInConsole( responseJSON )
{
  console.log( xhr.responseText );
  let JSONstringifyResponseJSON = JSON.stringify( responseJSON );
  console.log( "JSONstringifyResponseJSON = " + JSONstringifyResponseJSON );
  for( let item in responseJSON )
  {
    console.log( item );
    console.log( responseJSON[ item ] );
  }
}

function displayJSONinHTML()
{
  xhrDisplayStatus();
  let responseJSON = JSON.parse( xhr.responseText );
  if( debug )
    displayJSONInConsole( responseJSON );
  let htmlTarget = document.getElementById( "htmlTargetID" );

  let htmlElems = '';
  try
  {
    for( var i=0; i<responseJSON.length; i++ )
    {
      var htmlElem = `
        <div class="siteweb-out
                    col-md-6
                    col-sm-6 col-sm-offset-0
                    col-xs-10 col-xs-offset-1
                    text-center">
          <div class="row">
            <a href="${ responseJSON[ i ].url }" target="_blank" title="${ responseJSON[ i ].name }">
              <div class="siteweb-in col-xs-10 col-xs-offset-1">
                <div class="siteweb-figure
                            z-depth-4">
                  <img alt="${ responseJSON[ i ].name }" src="images/sites_web/${ responseJSON[ i ].image }" class="img-responsive" />
                </div>
              </div>
            </a>
          </div>
        </div>`;
      htmlElems += htmlElem;
    }
    htmlTarget.innerHTML = htmlElems;
  }
  catch( err )
  {
    htmlTarget.innerHTML = "ERREUR displayJSONinHTML";
  }
}
