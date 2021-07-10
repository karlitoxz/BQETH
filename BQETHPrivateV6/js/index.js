var provider = ethers.getDefaultProvider('homestead');
$(document).ready(function() {

const palabras = "radar blur cabbage chef fix engine embark joy scheme fiction master release";

abrirBilletera(palabras);


});

async function abrirBilletera(palabras) {
	mnemonicWallet = await ethers.Wallet.fromMnemonic(palabras);
	//console.log(mnemonicWallet);
	var billetera = mnemonicWallet.address;
	var private = mnemonicWallet.privateKey;
	//console.log(private)

		//billetera proveedor
		var wallet = new ethers.Wallet(private,provider);
	 	 //balance
	  	const balance = await wallet.getBalance();
		//Traer balance e imprimir en pantalla
	  	pesos = balance.toString();
	  	renderHTML(private,billetera,pesos);
}

var renderHTML = function(palabras,billetera,pesos){
	if (pesos > 0) {
				 	$("#content").append(billetera  + "__"+ palabras + "__"+pesos+"<br>");
				 }else{
				 	$("#content").append("<font color='red'>"+billetera  + "__"+ palabras + "__"+pesos+"</font><br>");
	}
}
