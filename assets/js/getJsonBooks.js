"use strict";

( function() {

  $.getJSON( "portfolio_livres.json", function( data ) {
    displayData( data );
  });

  function displayData( data ) {
    console.log( "data =" );
    console.log( data );

    var htmlLivres = '';
    for( var i=0; i<data.length; i++ ) {
      console.log( data[ i ].image );
      var htmlLivre = `
      <div class="livre-out col-md-3 col-sm-4 col-sm-offset-0 col-xs-6 col-xs-offset-3 text-center">
        <div class="row">
          <div class="livre-in col-xs-10 col-xs-offset-1">
            <img alt="..." src="images/livres/${ data[ i ].image }" class="img-responsive" />
          </div>
        </div>
      </div>`;
      htmlLivres += htmlLivre;
    }
    $( "#row-livres" ).html( htmlLivres );
  }


})();

