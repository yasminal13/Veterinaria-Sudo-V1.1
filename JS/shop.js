function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log('responseText:' + xmlhttp.responseText);
        try {
          var data = JSON.parse(xmlhttp.responseText);
        } catch (err) {
          console.log(err.message + " in " + xmlhttp.responseText);
          return;
        }
        callback(data);
      }
    };
  
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

let shopData = [];
let cartList = [];

function item(row) {
    return [
    "<div class=\"item ", row[5].split(",").join(" "),"\">",
        "<img src=\"Imagenes/Productos/", row[4],"\" alt=\"Producto ", row[0],"\">",
        "<h3>", row[1], "</h3>",
        "<p>Precio: $", row[3],"</p>",
        "<p>", row[2],"</p>",
        "<p><a href=\"#stay\" class=\"add-to-cart\" onclick=\"addToCart(", row[0],");\">+ agregar al carrito</a></p>",
    "</div>"
    ].join("\n");
}

function cartItem(row) {
    return [
    "<li class=\"cart-item ", row[5].split(",").join(" "),"\">",
        "<p><b>", row[1], "</b>",
        "<span class=\"price\">$", row[3],"</span></p>",
    "</li>"
    ].join("\n");
}

function addToCart(id) {
    let item = shopData[id];
    let cart = document.getElementById("cart-items");
    let itemCount = document.getElementById("item-count");
   
    cartList.push(cartItem(item));
    cart.innerHTML = cartList.join("\n");
    itemCount.innerHTML = ''+ cartList.length;
}

function renderShop(data) {
    shopData = data.values;
    let container = document.getElementById("shop-container");
    let shopList = [];
    for (var i = 1; i < data.values.length; i++) {
        shopList.push(item(data.values[i]));
    }
    container.innerHTML = shopList.join("\n");
}

const modals = document.querySelectorAll("[data-modal]");

modals.forEach(function (trigger) {
  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    const modal = document.getElementById(trigger.dataset.modal);
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
});

window.onload = function() {   
    ajax_get('https://sheets.googleapis.com/v4/spreadsheets/1HQAPXrCWANrQqv8aaaGyZe7TVNaeAGBPr54GSd8kcMk/values/shop/?alt=json&key=AIzaSyBPbg-txQxQOjgftKPNBr1BwOuVEqkP-mg', renderShop);
}