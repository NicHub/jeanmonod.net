"use strict";

( function() {

  $.getJSON( "portfolio_sites_web.json", function( data ) {
    displayData( data );
  });

  function displayData( data ) {
    console.log( "data =" );
    console.log( data );

    var htmlSitesweb = '';
    try {
      for( var i=0; i<data.length; i++ ) {
        var htmlSiteweb = `
          <div class="siteweb-out
                      col-md-6
                      col-sm-6 col-sm-offset-0
                      col-xs-10 col-xs-offset-1
                      text-center">
            <div class="row">
              <a href="${ data[ i ].url }" target="_blank">
                <div class="siteweb-in col-xs-10 col-xs-offset-1">
                  <div class="siteweb-figure
                              z-depth-4">
                    <img alt="${ data[ i ].name }" src="images/sites_web/${ data[ i ].image }" class="img-responsive" />
                  </div>
                </div>
              </a>
            </div>
          </div>`;
        htmlSitesweb += htmlSiteweb;
      }
      $( "#row-sitesweb" ).html( htmlSitesweb );
    }
    catch( err ) {
      $( "#row-sitesweb" ).html( "ERREUR" );
    }
  }

})();
