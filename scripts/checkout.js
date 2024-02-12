import { cart, removeCartItem, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./Utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOption.js";

renderOrderSummary();

function renderOrderSummary() {
  let cartItemHTML = "";


if (cart.length != 0) {
  createCartHTML();  
}

function createCartHTML() {
  cart.forEach((cartItem) => {
    const product = searchProduct(cartItem.productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId ) {        
        deliveryOption =  option;
      }      
    })
    const deliveryDate = (dayjs().add(deliveryOption.deliveryDays, 'days')).format('dddd, MMMM D');
    cartItemHTML += `
      <div class="cart-item-container js-cart-item-container" data-product-id = "${
        product.id
      }">
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>
  
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${product.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${formatCurrency(product.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${
                  cartItem.Quantity
                }</span>
              </span>
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-item" data-product-id = "${
                product.id
              }">
                Delete
              </span>
            </div>
          </div>
  
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(product.id, cartItem)}            
          </div>
        </div>
      </div>`;      
  });
}

document.querySelector(".js-order-summary").innerHTML = cartItemHTML;

document.querySelectorAll(".js-delete-item").forEach((link) => {
  link.addEventListener("click", () => {
    removeCartItem(link.dataset.productId);
    removeCartItemContainer(link.dataset.productId);
  });
});

function removeCartItemContainer(productId) {
  document.querySelectorAll(".js-cart-item-container").forEach((container) => {
    const containerId = container.dataset.productId;
    if (productId === containerId) {
      container.remove();
    }
  });
}

function searchProduct(productId) {
  let matchingProduct;
  products.forEach((product) => {
    if (productId === product.id) {
      matchingProduct = product;
      return matchingProduct;
    }
  });
  return matchingProduct;
}

function deliveryOptionsHTML(productId, cartItem) {
  let HTML = ``;
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = (today.add(deliveryOption.deliveryDays, 'days')).format('dddd, MMMM D');    
    const priceString = (deliveryOption.priceCents === 0 ? 'FREE -' : `$${formatCurrency(deliveryOption.priceCents)} -`);
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    
    HTML += `
    <div class="delivery-option js-delivery-option" data-product-id = "${productId}" data-delivery-Option-id = "${deliveryOption.id}">
      <input type="radio"
        class="delivery-option-input"
        name="delivery-option-${productId}"
        ${isChecked ? 'checked' : ''}>
      <div>
        <div class="delivery-option-date">
          ${deliveryDate}
        </div>
        <div class="delivery-option-price">
          ${priceString} - Shipping
        </div>
      </div>
    </div>
    `;
  })
  return HTML;
}

document.querySelectorAll('.js-delivery-option').forEach((option) => {
  option.addEventListener('click', () => {    
    const {productId, deliveryOptionId} = option.dataset;    
    updateDeliveryOption(productId,deliveryOptionId);
    renderOrderSummary();
  })
})

}
