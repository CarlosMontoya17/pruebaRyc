function enviarAlerta(){
   
    var nombre = document.getElementById('username').value; 
    var email = document.getElementById('email').value; 
    var phone = document.getElementById('phone').value; 
    var subject = document.getElementById('subject').value; 
    var message = document.getElementById('message').value; 
    
    const data = new URLSearchParams([["nombre", nombre], ["email", email], ["phone", phone], ["subject", subject], ["message", message]]);
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";
  fetch('https://gruporyc.com.mx:8081/send-email', {
     method: 'POST',
     body: data
  })
  .then(function(response) {
     if(response.ok) {
        alert("Su mensaje ha sido enviado. Nos contactaremos con usted por medio de su numero o correo electronico, muchas gracias por la confianza.");
         return response.text()       
     } else {
         throw "Error en la llamada Ajax";
     }
  })
  .catch(function(err) {
  });
  }


