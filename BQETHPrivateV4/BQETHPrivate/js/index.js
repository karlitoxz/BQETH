$(document).ready(function() {

	//var privatekey = 'e0e35463a97ee5b33ef0b29b2c57fa8276c4e76328cb19c98a6ea92c603a9c76';
	var privatekey = '0x1111111111111111111111111111111111111111';
	
	var datos;
	/*funciones*/
	listar(privatekey);
	//traecsv();

});


var traecsv = function(){
		$.ajax({
		  type: "GET",  
		  url: "pkeys.csv",
		  dataType: "text",       
		  success: function(response)  
		  {
			datos = $.csv.toArrays(response);
			leecsv(datos);
		  }   
	});
}

var leecsv = function(datos){
	$.each(datos, function( index, row ) {
		  //bind header

			$.each(row, function( index, colData ) {

				setTimeout(function() {
					if (index == 2) {
						/*$("#content").append( colData+ " "  + "<br>");*/
						//console.log('_'+colData);
						listar(colData);
					}
				},800);	
				
			});

		});
}


var listar = function(privatekey){
	$.ajax({
    //Cambiar a type: POST si necesario
    type: "GET",
    // URL a la que se enviará la solicitud Ajax
    url: "https://ethscan.app/search.php?q="+privatekey,
    dataType: 'json',
	})
	 .done(function(data) {
						console.log(data);
						/*if (data > 0)
						 {
						 	$("#content").append( "<br>" +data+ "-" + privatekey  + "<br>");
						 }else{
						 	$("#content").append(".");
						 }*/			
	 })
	 .fail(function( jqXHR, textStatus, errorThrown ) {
	     if ( console && console.log ) {
	         console.log( "La solicitud a fallado: " +  textStatus);
	     }
	});
}