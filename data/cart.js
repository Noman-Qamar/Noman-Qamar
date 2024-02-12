export let cart = JSON.parse(localStorage.getItem('cart'));
let matchingItem;
export function addtoCart(productId) {
  if(!cart) {
    cart = [];    
  } else {
    cart.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    })
  }
  if (matchingItem) {
    matchingItem.Quantity += 1;
  } else {
    cart.push({
      productId: productId,
      Quantity: 1,
      deliveryOptionId: '1'
    });
  }   
  saveCartToLocalStorage();
}
 
export function removeCartItem(productId) {    
  cart.forEach((item, index) => {    
    if (item.productId === productId) {        
      cart.splice(index,1);        
      return;
    }
  })  
  saveCartToLocalStorage();   
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOption) {
  cart.forEach((item) => {
    if (item.productId === productId) {
      item.deliveryOptionId = deliveryOption;
    }
  })
  saveCartToLocalStorage();
}

