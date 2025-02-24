import {cart, removeFromCart, updateDeliveryOption, calculateCartQuantity, updateQuantity} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';

 export function renderOrderSummary(){

    let cartSummaryHTML = ''; 

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId =cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        
        const dateString = deliveryDate.format(
            'dddd, MMMM D'
        );

        cartSummaryHTML += `
        <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}" alt="${matchingProduct.name}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                            Update
                        </span>
                        <input class="quantity-input js-quantity-${matchingProduct.id}">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}" style="display: none;">Save</span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
                            Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct , cartItem)}
                </div>
            </div>
        </div>
        `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem){

        let html = '';

        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(
                deliveryOption.deliveryDays, 
                'days'
            );
            const dateString = deliveryDate.format(
                'dddd, MMMM D'
            );

            const priceString = deliveryOption.priceCents === 0
            ? 'FREE'
            : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `
        <div class="delivery-option js-delivery-option"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryOption.id}">
                    <input type="radio"
                    ${isChecked ? 'checked': ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                    </div>
                </div>
            `

        });
        return html;
    }

    const orderSummaryContainer = document.querySelector('.js-order-summary');
    orderSummaryContainer.innerHTML = cartSummaryHTML;


    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(
            `.js-cart-item-container-${productId}`)
            container.remove();
            renderPaymentSummary();
            updateCartQuantity();

        });
    });
    function updateCartQuantity() {
        const cartQuantity = calculateCartQuantity();
        document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
    
        // Update total cost dynamically
        const totalCostElement = document.querySelector('.js-total-cost');
        const totalCost = cart.reduce((sum, item) => {
            const product = getProduct(item.productId);
            const deliveryOption = getDeliveryOption(item.deliveryOptionId);
            const productTotal =
                product.priceCents * item.quantity + deliveryOption.priceCents;
            return sum + productTotal;
        }, 0);
    
        if (totalCostElement) {
            totalCostElement.innerHTML = `$${formatCurrency(totalCost)}`;
        }
    }
    


    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
    
            // Update delivery date dynamically
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            const deliveryOption = getDeliveryOption(deliveryOptionId);
            const today = dayjs();
            const newDeliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const newDateString = newDeliveryDate.format('dddd, MMMM D');
    
            const deliveryDateElement = container.querySelector('.delivery-date');
            if (deliveryDateElement) {
                deliveryDateElement.innerHTML = `Delivery date: ${newDateString}`;
            }
    
            // Update payment summary without full re-rendering
            renderPaymentSummary();
        });
    });
    
    updateCartQuantity();
    
    
    



    document.querySelectorAll('.js-update-link')
            .forEach((link) => {
                link.addEventListener('click', () => {

                    const productId = link.dataset.productId;
                    
                    const container = document.querySelector(`.js-cart-item-container-${productId}`);
                    const quantityInput = container.querySelector(`.js-quantity-${productId}`);
                    const saveLink = container.querySelector('.js-save-link');

                    quantityInput.style.display = 'inline-block';
                    saveLink.style.display = 'inline-block';
                    link.style.display = 'none';
                });
            });

    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            const quantityInput = container.querySelector(`.js-quantity-${productId}`);
            const newQuantity = Number(quantityInput.value);
    
            if (newQuantity <= 0 || newQuantity >= 1000) {
                alert('Quantity must be at least 1 and less than 1000.');
                return;
            }
    
            // Update the cart and DOM
            updateQuantity(productId, newQuantity);
            const quantityLabel = container.querySelector(`.js-quantity-label-${productId}`);
            quantityLabel.innerHTML = newQuantity;
    
            // Hide input and save button, show update link
            quantityInput.style.display = 'none';
            link.style.display = 'none';
            const updateLink = container.querySelector('.js-update-link');
            updateLink.style.display = 'inline-block';
    
            // Update the total cost and summary
            updateCartQuantity();
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
    // Define getSelectedProductIds before using it
function getSelectedProductIds() {
    return cart.map(cartItem => cartItem.productId);
}

// Ensure DOM is loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const selectedProductIds = getSelectedProductIds();
    console.log(selectedProductIds); // Logs all selected product IDs
});

            
          document.addEventListener('DOMContentLoaded', () => {
            const selectedProductIds = getSelectedProductIds();
            console.log(selectedProductIds); // Logs all selected product IDs
        });
};