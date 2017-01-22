var pathName = window.location.pathname;
var pathArray = pathName.split('/');
var customID = pathArray[2];

$(document).ready(function() {

  //$("#urlbox").text(window.location.href);
  $("#urlbox").text("supperjio.com/XJdjs");
  populateOrders();
  document.getElementById("copyBtn").addEventListener("click", function() {
    copyToClipboard(window.location.href);
    $("#copyBtn").text("Copied!");
  });
  
  $('#addNameBtn').click(function(){
    var nameInput = $('.db-yourname').val();
    var validName = true;
    console.log(nameInput);
    if(nameInput===''){
      $('.db-yourname').css('border-color','red');
    } else {
      $.get('/private/getList/'+customID,function(orderList){
        orderList.forEach(function(order){
          console.log('Order.name '+order.name);
          if(nameInput.toLowerCase() === order.name.toLowerCase()){
            $('.db-yourname').css('border-color','red');
            $('.db-yourname').val('Name Taken');
            validName = false;
          }
        });
        if (validName){
          window.location.href = '/../../order/'+customID+'/?name='+nameInput;
        }
      })
    }
  });
  
  document.getElementById("addNameBtn").addEventListener("click", function() {
    console.log($("#ownerName").val());
    
  });
  
  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };
  document.getElementById("shareBtn").addEventListener("click", function() {
    if (isMobile.any()) {

      var text = "Open supper jio link:"
      var url = $(this).attr("data-link");
      var message = encodeURIComponent(text) + " - " + encodeURIComponent(url);
      var whatsapp_url = "whatsapp://send?text=" + message;
      window.location.href = whatsapp_url;
    } else {
      alert("Please share this link in mobile device");
    }

  });

function populateOrders(){
  var chunk = '';
  var prevOrder = '';
  var sum = 0;
  $.getJSON('/private/getList/'+customID, function(data) {
    $.each(data, function(key, val) {
        console.log(val);
        var menuName = val.order;
        var menuPrice = parseFloat((val.price + "").replace('$', ''));
      console.log("menu price = " + menuPrice);
        var menuQty = parseInt(val.quantity);
        var menuComments = val.comment;
        if (menuComments == null){
          menuComments = '';
        } else if ($.trim(menuComments)===''){

        } else{
          menuComments = "(" + menuComments + ")";
        }
        var ownerName = val.name;
        if (ownerName !== prevOrder) {
          if (prevOrder !== ''){
            chunk = '<tr><td colspan ="2"></td><td>Subtotal:</td><td>' + parseFloat(sum).toFixed(2) + '</td>';
            $("#tableOrders").append(chunk);
            sum = 0;
          }
          chunk = "<tr><td>" + ownerName + "</td><td colspan = '3'>(edit order)</td>";
          $("#tableOrders").append(chunk);
          prevOrder = ownerName;
        }
        //console.log("sum = " + menuQty + " * " + menuPrice + " = " + menuQty*menuPrice);  
      sum += menuQty * menuPrice;
        
        chunk = "<tr><td></td><td>" + menuName + "</td><td>" + menuQty + "</td><td>" + menuPrice;
        if (menuQty === 1)
          chunk += "</td></tr>";
        else
          chunk += " (" + parseFloat(menuQty * parseFloat((menuPrice + "").replace('$', ''))).toFixed(2) + ")</td></tr>";
        $("#tableOrders").append(chunk);
      
    });
    
    if (prevOrder !== ''){
            chunk = '<tr><td colspan ="2"></td><td>Subtotal:</td><td>' + parseFloat(sum).toFixed(2) + '</td>';
            $("#tableOrders").append(chunk);
            sum = 0;
          }

  });
}
  
function copyToClipboard(url) {
    var aux = document.createElement("input");
    aux.setAttribute("value", url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }
});
