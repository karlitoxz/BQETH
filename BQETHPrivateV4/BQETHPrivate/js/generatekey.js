var provider = ethers.getDefaultProvider('homestead');

$(document).ready(function() {


//clave generada
		/*var private = generarkey();
		var valores = traerInformacion(private);
		console.log(valores);	
		var billetera = valores[0];
		var balance = valores[1];
		$("#content").append(  billetera  + "__"+ private);*/
//claveCSV
	traecsv();
	//traerBalance(billetera);

});

//FUNCIONES:

var generarkey = function(){
     	var private = "";
      var possible = "0123456789abcdef";
      for (var i = 0; i < 64; i++)
          private += possible.charAt(Math.floor(Math.random() * possible.length));
      return private;
}

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
						traerInformacion(colData);
							//console.log(colData);
					}
				},2000);	
				
			});

		});
}


async function traerInformacion(private) {
		//billetera
			var wallet = new ethers.Wallet('0x' + private,provider);
			var billetera = wallet.address;
		//balance
			const balance = await wallet.getBalance();
			//Traer balance e imprimir en pantalla
			pesos = balance.toString();
			renderHTML(private,billetera,pesos);

}

var renderHTML = function(private,billetera,pesos){
	if (pesos > 0) {
				 	$("#content").append(billetera  + "__"+ private + "__"+pesos+"<br>");
				 }else{
				 	$("#content").append("<font color='red'>"+billetera  + "__"+ private + "__"+pesos+"</font><br>");
	}
}

var traerBalance = function(ethaddress){
	$.ajax({
    //Cambiar a type: POST si necesario
    type: "GET",
    // URL a la que se enviarĂ¡ la solicitud Ajax
    url: "https://api.etherscan.io/api?module=account&action=balance&address="+ethaddress,
    dataType: 'json',
	})
	 .done(function(data) {
	 	$("#content").append(  data.result  + "<br>");
						
	 });
}