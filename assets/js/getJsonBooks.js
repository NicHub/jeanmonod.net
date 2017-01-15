"use strict";

( function() {

  $.getJSON( "portfolio_livres.json", function( data ) {
    displayData( data );
  });

  function displayData( data ) {
    // console.log( "data =" );
    // console.log( data );
    var htmlLivres = '';
    try {
      for( var i=0; i<data.length; i++ ) {
        var htmlLivre = `
          <div class="livre-out
                      text-center
                      col-md-3
                      col-sm-4 col-sm-offset-0
                      col-xs-6 col-xs-offset-0">
            <div class="row">
              <a href="${ data[ i ].url }" target="_blank">
                <div class="livre-figure
                            z-depth-4">
                  <img alt="..." src="images/livres/${ data[ i ].image }" class="img-responsive" />
                </div>
              </a>
            </div>
          </div>`;
        htmlLivres += htmlLivre;
      }
      $( "#row-livres" ).html( htmlLivres );
    }
    catch( err ) {
      $( "#row-livres" ).html( "ERREUR" );
    }
  }

})();
