export const GHL_CONFIG = {
  // Production credentials
  production: {
    clientId: process.env.NEXT_PUBLIC_GHL_CLIENT_ID,
    clientSecret: process.env.GHL_CLIENT_SECRET,
    redirectUri: process.env.NEXT_PUBLIC_GHL_REDIRECT_URI,
    scopes: [
      "contacts.readonly",
      "contacts.write",
      "tags.readonly",
      "tags.write",
      "customFields.readonly",
      "customFields.write",
      "opportunities.readonly",
      "opportunities.write",
    ],
    apiBaseUrl: "https://rest.gohighlevel.com/v1",
    webhookUrl: process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL,
  },

  // Test credentials for GHL review team
  test: {
    clientId:
      process.env.NEXT_PUBLIC_GHL_TEST_CLIENT_ID || "test_client_id_123",
    clientSecret:
      process.env.GHL_TEST_CLIENT_SECRET || "test_client_secret_456",
    redirectUri:
      process.env.NEXT_PUBLIC_GHL_TEST_REDIRECT_URI ||
      "https://your-test-domain.com/ghl/callback",
    scopes: [
      "contacts.readonly",
      "contacts.write",
      "tags.readonly",
      "tags.write",
      "customFields.readonly",
      "customFields.write",
      "opportunities.readonly",
      "opportunities.write",
    ],
    apiBaseUrl: "https://rest.gohighlevel.com/v1",
    webhookUrl: process.env.NEXT_PUBLIC_GHL_TEST_WEBHOOK_URL,
    // Test account credentials
    testAccount: {
      email: "ghl-review@bananacrystal.com",
      password: "Test@123456",
      apiKey: "test_api_key_789",
      locationId: "test_location_123",
    },
  },
};

// GHL API endpoints
export const GHL_ENDPOINTS = {
  contacts: "/contacts",
  tags: "/tags",
  customFields: "/custom-fields",
  opportunities: "/opportunities",
  webhooks: "/webhooks",
  oauth: {
    authorize: "https://marketplace.gohighlevel.com/oauth/chooselocation",
    token: "https://services.gohighlevel.com/oauth/token",
  },
};

// Custom fields for payment tracking
export const GHL_CUSTOM_FIELDS = {
  payment: {
    transactionHash: {
      name: "Transaction Hash",
      type: "text",
      required: false,
    },
    paymentStatus: {
      name: "Payment Status",
      type: "select",
      options: ["pending", "completed", "failed"],
      required: true,
    },
    paymentAmount: {
      name: "Payment Amount",
      type: "number",
      required: true,
    },
    paymentCurrency: {
      name: "Payment Currency",
      type: "text",
      required: true,
    },
    productName: {
      name: "Product Name",
      type: "text",
      required: true,
    },
    paymentDate: {
      name: "Payment Date",
      type: "date",
      required: true,
    },
  },
};

// Default tags for payment status
export const GHL_TAGS = {
  payment: {
    pending: "payment_pending",
    completed: "payment_completed",
    failed: "payment_failed",
  },
  product: {
    prefix: "product_",
  },
};

// Webhook events to subscribe to
export const GHL_WEBHOOK_EVENTS = {
  contact: {
    created: "contact.created",
    updated: "contact.updated",
    deleted: "contact.deleted",
  },
  opportunity: {
    created: "opportunity.created",
    updated: "opportunity.updated",
    deleted: "opportunity.deleted",
  },
};
