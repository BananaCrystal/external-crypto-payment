import GHLService from "../src/services/ghlService";
import { GHL_TAGS, GHL_CUSTOM_FIELDS } from "../src/config/ghlConfig";

// Test data
const TEST_CONTACT = {
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  phone: "+1234567890",
};

const TEST_PAYMENT = {
  amount: 100,
  currency: "USD",
  description: "Test Product",
  productName: "Test Product",
};

async function runTests() {
  console.log("🚀 Starting GoHighLevel Integration Tests...\n");

  // Initialize GHL Service with test credentials
  const ghlService = new GHLService(
    process.env.NEXT_PUBLIC_GHL_TEST_API_KEY || "",
    process.env.NEXT_PUBLIC_GHL_TEST_LOCATION_ID || "",
    true // Test mode
  );

  try {
    // Test 1: Create Contact
    console.log("📝 Test 1: Creating Contact...");
    const contact = await ghlService.createContact(TEST_CONTACT);
    console.log("✅ Contact created:", contact.id);
    const contactId = contact.id;

    // Test 2: Add Product Tag
    console.log("\n📝 Test 2: Adding Product Tag...");
    const productTag = `${GHL_TAGS.product.prefix}${TEST_PAYMENT.productName}`;
    await ghlService.addTag(contactId, productTag);
    console.log("✅ Product tag added");

    // Test 3: Update Payment Status (Pending)
    console.log("\n📝 Test 3: Updating Payment Status to Pending...");
    await ghlService.updatePaymentStatus(contactId, "Pending");
    console.log("✅ Payment status updated to Pending");

    // Test 4: Update Payment Status (Completed)
    console.log("\n📝 Test 4: Updating Payment Status to Completed...");
    await ghlService.updatePaymentStatus(
      contactId,
      "Completed",
      "test_transaction_hash_123"
    );
    console.log("✅ Payment status updated to Completed");

    // Test 5: Verify Custom Fields
    console.log("\n📝 Test 5: Verifying Custom Fields...");
    const customFields = await ghlService.getCustomFields();
    const paymentFields = customFields.filter((field) =>
      Object.values(GHL_CUSTOM_FIELDS.payment).some(
        (f) => f.name === field.name
      )
    );
    console.log("✅ Custom fields verified:", paymentFields.length);

    // Test 6: Get Contact Details
    console.log("\n📝 Test 6: Getting Contact Details...");
    const updatedContact = await ghlService.getContact(contactId);
    console.log("✅ Contact details retrieved:", {
      id: updatedContact.id,
      email: updatedContact.email,
      tags: updatedContact.tags,
      customFields: updatedContact.customField,
    });

    // Test 7: Simulate Webhook Events
    console.log("\n📝 Test 7: Simulating Webhook Events...");
    await ghlService.handleWebhook("contact.updated", {
      contactId,
      event: "contact.updated",
      data: updatedContact,
    });
    console.log("✅ Webhook event handled");

    console.log("\n✨ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);
