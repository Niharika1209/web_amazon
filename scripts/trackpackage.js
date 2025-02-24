
import { cart } from '../data/cart.js';
import { getProduct } from '../data/products.js';

function updateTrackingUI() {
    cart.forEach((cartItem) => {
        const matchingItem = getProduct(cartItem.productId);
        if (matchingItem) {
            const trackingButton = document.querySelector(`.js-track-package-${matchingItem.id}`);
            if (trackingButton) {
                trackingButton.addEventListener('click', () => {
                    document.querySelector('.js-tracking-info').innerHTML = `
                        <div class="delivery-date">Arriving on ${matchingItem.deliveryDate || 'TBD'}</div>
                        <div class="product-info">${matchingItem.name}</div>
                        <div class="product-info">Quantity: ${cartItem.quantity}</div>
                        <img class="product-image" src="${matchingItem.image}">
                        <div class="progress-labels-container">
                            <div class="progress-label">Preparing</div>
                            <div class="progress-label current-status">Shipped</div>
                            <div class="progress-label">Delivered</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar"></div>
                        </div>`;
                });
            }
        }
    });
}

updateTrackingUI();
