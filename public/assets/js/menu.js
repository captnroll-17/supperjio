var pathName = window.location.pathname;
var pathArray = pathName.split('/');
var customID = pathArray[2];

$(document).ready(function() {
  processMenu();

  var ownerName = GetURLParameter("name");
  $("#owner").text(ownerName);

  populateOwnerOrders();

  $(document).on('click', '.addQty', function(e) {
    add($(this));
  });

  $(document).on('click', '.subtractQty', function(e) {
    subtract($(this));
  });

  $("#viewOrderBtn").click(function() {
    populateOwnerViewOrder();
    populateOtherOrders();
  });

  $(document).on('click', '#submitBtn', function(e) {
    console.log("submitBtn");
    var results = [];


    $(".order-qty").each(function(index) {

      var qty = parseInt($(this).text());
      if (qty !== 0) {
        var resultObject = {};
        var menuName = $(this).parent().parent().find(".menu-name").text();
        var menuPrice = $(this).parent().parent().find(".menu-price").text();
        var menuQty = qty;
        var menuComments = $(this).parent().parent().find(".menu-comments").val();
        resultObject.order = menuName;
        resultObject.price = menuPrice.split('$')[1];
        resultObject.quantity = menuQty;
        resultObject.comment = menuComments;
        resultObject.name = $('#owner').text();
        resultObject.customID = customID;
        results.push(resultObject);
        // console.log(results);
      }
    });
    $.ajax({
      url: '/private/postOrder/' + customID,
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(results)
    }).done(window.location.href = '/name/'+customID);
  });


});

function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}


function populateOwnerViewOrder() {
  $("#tableOrders").find("tr:gt(0)").remove();
  var chunk = "";
  var minOrder = false;
  $(".order-qty").each(function(index) {
    var qty = parseInt($(this).text());
    if (qty !== 0) {
      var menuName = $(this).parent().parent().find(".menu-name").text();
      var menuPrice = $(this).parent().parent().find(".menu-price").text();
      var menuQty = qty;
      var menuComments = $(this).parent().parent().find(".menu-comments").val();
      if (menuComments == null) {
        menuComments = '';
      } else if ($.trim(menuComments) === '') {

      } else {
        menuComments = "(" + menuComments + ")";
      }
      var ownerName = $('#owner').text();
      console.log("item = " + menuName + " qty = " + menuQty);
      if (minOrder === false) {
        chunk = "<tr><td>" + ownerName + "</td><td>" + menuName + menuComments + "</td><td>" + qty + "</td><td>" + menuPrice;
        minOrder = true;
      } else {
        chunk = "<tr><td></td><td>" + menuName + menuComments + "</td><td>" + qty + "</td><td>" + menuPrice;
      }
      if (qty === 1)
        chunk += "</td></tr>";
      else
        chunk += " (" + parseFloat(qty * parseFloat(menuPrice.replace('$', ''))).toFixed(2) + ")</td></tr>";
      $("#tableOrders").append(chunk);
    }
  });
}

function populateOtherOrders() {
  var chunk = "";
  var prevOrder = "";
  $.getJSON("/private/getList/"+customID, function(data) {
    var items = [];
    $.each(data, function(key, val) {
      if (val.name != $('#owner').text()) {
        var menuName = val.order;
        var menuPrice = val.price + "";
        var menuQty = parseInt(val.quantity);
        var menuComments = val.comment;
        if (menuComments == null) {
          menuComments = '';
        } else if ($.trim(menuComments) === '') {

        } else {
          menuComments = "(" + menuComments + ")";
        }
        var ownerName = val.name;
        if (ownerName === prevOrder) {
          chunk = "<tr><td></td><td>" + menuName + "</td><td>" + menuQty + "</td><td>" + menuPrice;
        } else {
          chunk = "<tr><td>" + ownerName + "</td><td>" + menuName + menuComments + "</td><td>" + menuQty + "</td><td>" + menuPrice;
        }
        prevOrder = ownerName;
        if (menuQty === 1)
          chunk += "</td></tr>";
        else
          chunk += " (" + parseFloat(menuQty * parseFloat(menuPrice.replace('$', ''))).toFixed(2) + ")</td></tr>";
        $("#tableOrders").append(chunk);
      }
    });
  });
}

function populateOwnerOrders(){
  var nameOfOwner= $('#owner').text();
  $.getJSON('/private/getList/'+customID, function(data) {
    console.log(data);
    var items = [];
    $.ajax({
      url: '/private/delete/'+customID+'/'+nameOfOwner,
      type: 'DELETE'

    });
    $.each(data, function(key, val) {
      console.log(val.name);
      var menuName = val.order;
      var menuQty = parseInt(val.quantity);
      if(val.name===$('#owner').text()){
        console.log($('#'+menuName));
        var param = menuName.replace(/\s/g,'');
        console.log(param);
        console.log(menuQty);
        $(`#${param}`).text(menuQty);
        $('#'+param).text(menuQty);
      }
    //   if (val.name === $('#owner').text()){
    //     console.log($('#'menuName));
    // }
  });

  });
};

function add(e) {
  var qty = parseInt(e.prev().text());
  qty = qty + 1;
  e.prev().text(qty);
  e.parent().parent().find("input").attr("type", "");
  updatePrice(1, parseFloat(e.parent().prev().text().trim().replace('$', '')));
}

function subtract(e) {
  var qty = parseInt(e.next().text());
  if (qty > 0) {
    qty -= 1;
    e.next().text(qty);
    updatePrice(-1, parseFloat(e.parent().prev().text().trim().replace('$', '')));
  }
  if (qty === 0) {
    e.parent().parent().find("input").attr("type", "hidden");
  }
}

function processMenu() {
  var section = "";
  var count = 0;
  var chunk = "";
  $.getJSON("/private/menu", function(poplist) {
    poplist.sort((a, b) => {
      var nameA = parseInt(a.frequency);
      var nameB = parseInt(b.frequency);
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
    $.each(poplist, function(key, val) {
      if (key < 5) {
        chunk = '<tr><td class = "menu-name">' + val.title + '<br><input type="hidden" class ="menu-comments" type="text" name="comments" placeholder="Comments" ></td><td class = "menu-price">$' + val.price + '</td><td class="menu-qty"><button class="xsmall subtractQty">-</button><span class="order-qty">0</span><button class="xsmall addQty">+</button></td></tr>';
        //chunk = '<tr><td>test1</td><td>test2></td><td>test3</td></tr>';
        $("#popularTable").append(chunk);
      }
    });
  });


  $.getJSON("/private/menu", function(data) {
    var section = "";
    var count = 0;
    var chunk = "";
    var items = [];
    $.each(data, function(key, val) {
      var param = val.title.replace(/\s/g,'');
      if (section != val.section) {
        section = val.section;
        if (count === 0) {
          count = 1;
        } else {
          chunk += '</table></details>';
          $("#menu-wrapper").append(chunk);
          chunk = "";
        }
        chunk += '<details><summary class ="menu-summary">' + val.section + '</summary><table><tr><td class = "menu-name">' + val.title + `<br><input type="hidden" class ="menu-comments" type="text" name="comments" placeholder="Comments" ></td><td class = "menu-price">$` + val.price + '</td><td class="menu-qty"><button class="xsmall subtractQty">-</button><span class="order-qty" id="'+param+'">0</span><button class="xsmall addQty">+</button></td></tr>';

      } else {
        chunk += '<tr><td class = "menu-name">' + val.title + '<br><input type="hidden" class ="menu-comments" type="text" name="comments" placeholder="Comments" ></td><td class = "menu-price">$' + val.price + '</td><td class="menu-qty"><button class="xsmall subtractQty">-</button><span class="order-qty" id="'+param+'">0</span><button class="xsmall addQty">+</button></td></tr>';
      }

    });
    $("#menu-wrapper").append(chunk);
  });

}

function updatePrice(qty, price) {
  var totalPrice = parseFloat($('#totalPrice').text());
  totalPrice += parseInt(qty) * parseFloat(price);
  totalPrice = parseFloat(totalPrice).toFixed(2);
  $('#totalPrice').text(totalPrice);
}