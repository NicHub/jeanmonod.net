"use strict";

var url = "portfolio_livres.json";
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
        <div class="livre-out
                    text-center
                    col-md-3
                    col-sm-4 col-sm-offset-0
                    col-xs-6 col-xs-offset-0">
          <div class="row">
            <a href="${ responseJSON[ i ].url }" target="_blank" title="voir\n${ responseJSON[ i ].name }\nsur\n${ responseJSON[ i ].url }">
              <div class="livre-figure
                          z-depth-4">
                <img alt="${ responseJSON[ i ].name }" src="images/livres/${ responseJSON[ i ].image }" class="img-responsive" />
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
