// Test file to check the import of PaymentForm from banana-crystal-payment
// Method 1: Named import
const { PaymentForm } = require('banana-crystal-payment');
console.log('PaymentForm (named import):', PaymentForm);

// Method 2: Default import
const PaymentFormDefault = require('banana-crystal-payment');
console.log('PaymentForm (default import):', PaymentFormDefault);
console.log('PaymentForm (default import).default:', PaymentFormDefault.default);

// Method 3: Full module
const BananaCrystalPayment = require('banana-crystal-payment');
console.log('BananaCrystalPayment:', BananaCrystalPayment);
console.log('BananaCrystalPayment.PaymentForm:', BananaCrystalPayment.PaymentForm);
