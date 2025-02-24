
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { total } from './checkout/paymentSummary.js';
import { formatCurrency } from './utils/money.js';
import {getProduct } from '../data/products.js';
import { cart } from '../data/cart.js';

const today = dayjs();
const dateString = today.format('MMMM D');

document.querySelector('.js-placed-date').innerHTML = dateString;
document.querySelector('.totalcost').innerHTML = `$${formatCurrency(total())}`;

function details() {
    let orderHTML = '';  
    cart.forEach((cartItem) => {
        const matchingItem = getProduct(cartItem.productId); 

        orderHTML += `
            <div class="product-image-container">
                <img src="${matchingItem.image}" alt="${matchingItem.name}">
            </div>
    
            <div class="product-details">
                <div class="product-name">
                    ${matchingItem.name}
                </div>
                <div class="product-delivery-date">
                    Arriving on: August 15
                </div>
                <div class="product-quantity">
                    Quantity: ${cartItem.quantity}  <!-- Use cartItem.quantity here -->
                </div>
                <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy Again Icon">
                    <span class="buy-again-message">Buy it again</span>
                </button>
            </div>
    
            <div class="product-actions">
                <a href="tracking.html">
                    <button class="track-package-button button-secondary">
                        Track package
                    </button>
                </a>
            </div>
        `;
    });

    document.querySelector('.js-order-display').innerHTML = orderHTML;
};

details();
let  cartQuantity = 0;
cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
});

document.querySelector('.js-cart-quantity1').innerHTML =  cartQuantity;
