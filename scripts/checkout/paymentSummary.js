import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { calculateCartQuantity } from '../../data/cart.js';

let totalBeforeTaxCents;
let taxCents;
let totalCents;

export function renderPaymentSummary() {
    totalBeforeTaxCents = totalBefore();
    taxCents = calculateTax();
    totalCents = total();

    
    const paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div class="js-count">Items (${calculateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPrice())}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPrice())}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary js-order-place">
            Place your order
        </button>
    `;

  
    const paymentSummaryElement = document.querySelector('.js-payment-summary');
    if (paymentSummaryElement) {
        paymentSummaryElement.innerHTML = paymentSummaryHTML;

       
        const buttonElement = paymentSummaryElement.querySelector('.js-order-place');
        if (buttonElement) {
            buttonElement.addEventListener('click', locate);
        }
    }
}

function totalBefore() {
    return productPrice() + shippingPrice();
}

function productPrice() {
    let productPriceCents = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        if (product) {
            productPriceCents += product.priceCents * cartItem.quantity;
        }
    });
    return productPriceCents;
}

function shippingPrice() {
    let shippingPriceCents = 0;
    cart.forEach((cartItem) => {
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        if (deliveryOption) {
            shippingPriceCents += deliveryOption.priceCents;
        }
    });
    return shippingPriceCents;
}

function calculateTax() {
    return Math.round(totalBefore() * 0.1); 
}

export function total() {
    return totalBefore() + calculateTax();
}

function locate() {
    window.location.href = 'orders.html'; 
}