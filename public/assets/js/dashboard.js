var pathName = window.location.pathname;
var pathArray = pathName.split('/');
var customID = pathArray[2];

$(document).ready(function() {

  $("#urlbox").val(window.location.href);
  //$("#urlbox").text("supperjio.com/XJdjs");
  populateOrders();
  document.getElementById("copyBtn").addEventListener("click", function() {
    copyToClipboard(window.location.href);
    $("#copyBtn").text("Copied!");
  });

  $('#addNameBtn').click(function() {
    var nameInput = $('.db-yourname').val();
    var validName = true;
    console.log(nameInput);
    if (nameInput === '') {
      $('.db-yourname').css('border-color', 'red');
    } else {
      $.get('/private/getList/' + customID, function(orderList) {
        orderList.forEach(function(order) {
          console.log('Order.name ' + order.name);
          if (nameInput.toLowerCase() === order.name.toLowerCase()) {
            $('.db-yourname').css('border-color', 'red');
            $('.db-yourname').val('Name Taken');
            validName = false;
          }
        });
        if (validName) {
          window.location.href = '/../../order/' + customID + '/?name=' + nameInput;
        }
      })
    }
    });

    document.getElementById("addNameBtn").addEventListener("click", function() {

    });
    $(document).on('click', '.editButton',function(t){
    event.preventDefault();
    var name = $(t.target).parent().prev().text();
    window.location.href= '/order/'+customID+'?name='+name;
    // console.log(t.target);
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
        var url = window.location.href;
        var message = encodeURIComponent(text) + " - " + encodeURIComponent(url);
        var whatsapp_url = "whatsapp://send?text=" + message;
        window.location.href = whatsapp_url;
      } else {
        alert("Please share this link in mobile device");
      }
    });

    $("#consolidatedOrdersBtn").click(function() {
      $("#tableConsolidatedOrders").find("tr:gt(0)").remove();
      var chunk = '';
      var prevOrder, prevComment, prevQty, prevPrice, currentComment, deliveryFee=3;
      var totalPrice = deliveryFee;
      $.getJSON("/private/getList/"+customID, function(data) {
        data.sort((a, b) => {
          var nameA = a.order.toLowerCase();
          var nameB = b.order.toLowerCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        $.each(data, function(key, val) {
          totalPrice += parseInt(val.quantity) * parseFloat(val.price);
          
          if (key === 0) {
            prevOrder = val.order;
            prevComment = val.comment;
            if (prevComment == null) {
              prevComment = '';
            } else if ($.trim(prevComment) === '') {

            } else {
              prevComment = "(" + prevComment + ")";
            }
            prevQty = val.quantity;
            prevPrice = val.price;
          } else {
            
            currentComment = val.comment;
            if (currentComment == null) {
              currentComment = '';
            } else if ($.trim(currentComment) === '') {

            } else {
              currentComment = "(" + currentComment + ")";
            }
            if ((prevOrder !== val.order)  ||  ( prevComment !== currentComment)) { //different items
              if (prevQty > 1)
                chunk = '<tr><td>' + prevOrder + prevComment + '</td><td>' + prevQty + '</td><td>' + prevPrice + ' (' + parseFloat(prevQty * prevPrice).toFixed(2) + ')</td></tr>';
              else
                chunk = '<tr><td>' + prevOrder + prevComment + '</td><td>' + prevQty + '</td><td>' + prevPrice + '</td></tr>';
              $('#tableConsolidatedOrders').append(chunk);
              prevQty = val.quantity;
              prevOrder = val.order;
              prevComment = val.comment;
              if (prevComment == null) {
                prevComment = '';
              } else if ($.trim(prevComment) === '') {

              } else {
                prevComment = "(" + prevComment + ")";
              }
              prevPrice = val.price;
            } else{ //same items
              prevQty += val.quantity;
            }
            
          }
});
if (prevQty > 1)
  chunk = '<tr><td>' + prevOrder + prevComment + '</td><td>' + prevQty + '</td><td>' + prevPrice + ' (' + parseFloat(prevQty * prevPrice).toFixed(2) + ')</td></tr > ';
else
  chunk = '<tr><td>' + prevOrder + prevComment + '</td><td>' + prevQty + '</td><td>' + prevPrice + '</td></tr>';
$('#tableConsolidatedOrders').append(chunk);
chunk = '<tr><td colspan ="2">Total:</td>' + '<td>$ ' + parseFloat(totalPrice).toFixed(2) + '</td></tr>';
        $('#tableConsolidatedOrders').append(chunk);
      });
      
    });
  
  function populateOrders() {
    var chunk = '';
    var prevOrder = '';
    var sum = 0;
    var deliveryFee = 2;
    var totalPrice = deliveryFee;
    var numberOfPeople = 0;
    $.getJSON("/private/getList/"+customID, function(data) {
      $.each(data, function(key, val) {
        totalPrice += parseInt(val.quantity) * parseFloat(val.price);
        var menuName = val.order;
        var menuPrice = parseFloat((val.price + "").replace('$', ''));
        var menuQty = parseInt(val.quantity);
        var menuComments = val.comment;
        if (menuComments == null) {
          menuComments = '';
        } else if ($.trim(menuComments) === '') {

        } else {
          menuComments = "(" + menuComments + ")";
        }
        var ownerName = val.name;
        if (ownerName !== prevOrder) {
          if (prevOrder !== '') {
            chunk = '<tr><td colspan ="2"></td><td>Subtotal:</td><td>' + parseFloat(sum).toFixed(2) + '</td>';
            $("#tableOrders").append(chunk);
            sum = 0;
          }
          chunk = "<tr><td>" + ownerName + "</td><td colspan = '3'><a href='' class ='editButton' style='color:white'>(edit order)</a></td>";
          $("#tableOrders").append(chunk);
          prevOrder = ownerName;
        }
        //console.log("sum = " + menuQty + " * " + menuPrice + " = " + menuQty*menuPrice);  
        sum += menuQty * menuPrice;

        chunk = "<tr><td></td><td>" + menuName + menuComments + "</td><td>" + menuQty + "</td><td>" + menuPrice;
        if (menuQty === 1)
          chunk += "</td></tr>";
        else
          chunk += " (" + parseFloat(menuQty * parseFloat((menuPrice + "").replace('$', ''))).toFixed(2) + ")</td></tr>";
        $("#tableOrders").append(chunk);

      });

      if (prevOrder !== '') {
        chunk = '<tr><td colspan ="2"></td><td>Subtotal:</td><td>' + parseFloat(sum).toFixed(2) + '</td></tr>';
        $("#tableOrders").append(chunk);
        sum = 0;
      }
      chunk = '<tr><td colspan ="2"></td><td>Delivery:</td><td>' + parseFloat(deliveryFee).toFixed(2) + '</td></tr>';
      $("#tableOrders").append(chunk);
      chunk = '<tr><td colspan ="2"></td><td>Grand Total:</td><td>' + parseFloat(totalPrice).toFixed(2) + '</td></tr>';
      $("#tableOrders").append(chunk);
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