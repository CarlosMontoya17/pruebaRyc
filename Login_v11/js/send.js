function enviarAlerta(){
    var nombre = document.getElementById('name').value; 
    var email = document.getElementById('email').value; 
    var phone = document.getElementById('phone').value; 
    var nss = document.getElementById('nss').value; 
    var fecha = document.getElementById('fecha').value; 
    const data = new URLSearchParams([["nombre", nombre], ["email", email], ["tel", phone], ["nss", nss], ["fecha", fecha]]);
    document.getElementById("name").value = ""; 
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("nss").value = "";
    document.getElementById("fecha").value = "";
  fetch('https://gruporyc.com.mx:8081/sendPrecalificacion', {
     method: 'POST',
     body: data
  })
  .then(function(response) {
     if(response.ok) {
         return response.text()
     } else {
         throw "Error en la llamada Ajax";
     }
  })
  .then(function(texto) {
     console.log(texto);
  })
  .catch(function(err) {
     console.log(err);
  });
  }