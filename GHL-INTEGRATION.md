# Banana Crystal Payments - GoHighLevel Integration

## Overview

Banana Crystal Payments is a powerful GoHighLevel plugin that enables businesses to accept stablecoin payments (USDT) directly within their GoHighLevel account. The integration provides seamless contact management, automated tagging, and comprehensive payment tracking.

## Features

- **Stablecoin Payments**: Accept USDT payments on the Polygon network
- **Automated Contact Management**: Create and update contacts automatically
- **Smart Tagging**: Automatic tagging based on payment status
- **Custom Fields**: Track payment details and transaction history
- **Webhook Support**: Real-time updates for payment status changes
- **Mobile-Ready**: Fully responsive payment forms
- **Secure Processing**: Enterprise-grade security for all transactions

## Installation

1. Log in to your GoHighLevel account
2. Navigate to Integrations > Marketplace
3. Search for "Banana Crystal Payments"
4. Click "Install"
5. Follow the OAuth authorization process
6. Configure your payment settings

## Configuration

### Required Settings

- Store ID (from your Banana Crystal account)
- GoHighLevel API Key
- Payment Window Duration
- Redirect URLs

### Optional Settings

- Custom Branding
- Additional Tags
- Webhook Endpoints
- Custom Fields

## Test Credentials

For testing purposes, use the following credentials:

```
Email: ghl-review@bananacrystal.com
Password: Test@123456
API Key: test_api_key_789
Location ID: test_location_123
```

## Required Scopes

The plugin requires the following GoHighLevel scopes:

- `contacts.readonly`: Read contact information
- `contacts.write`: Create and update contacts
- `tags.readonly`: Read existing tags
- `tags.write`: Add and remove tags
- `customFields.readonly`: Read custom field values
- `customFields.write`: Create and update custom fields
- `opportunities.readonly`: Read opportunity data
- `opportunities.write`: Create and update opportunities

## Video Demonstration

[Link to video demonstration showing why each scope is needed]

### Scope Usage Demonstration

1. **Contact Management (contacts.readonly, contacts.write)**

   - Creating new contacts for payment processing
   - Updating contact information with payment status
   - Reading contact history for payment verification

2. **Tag Management (tags.readonly, tags.write)**

   - Adding payment status tags (paid, not_paid, etc.)
   - Removing old status tags
   - Reading existing tags for validation

3. **Custom Fields (customFields.readonly, customFields.write)**

   - Creating payment-related custom fields
   - Updating payment status and transaction details
   - Reading payment history

4. **Opportunity Management (opportunities.readonly, opportunities.write)**
   - Creating opportunities for pending payments
   - Updating opportunity status after payment
   - Reading opportunity data for payment tracking

## Support

- Email: support@bananacrystal.com
- Phone: +1234567890
- Documentation: https://bananacrystal.com/docs/ghl
- FAQ: https://bananacrystal.com/docs/ghl/faq

## Security

- All API keys are encrypted at rest
- OAuth 2.0 authentication
- HTTPS for all communications
- Regular security audits
- GDPR compliant

## Privacy

- We only access the data necessary for payment processing
- All data is handled according to our privacy policy
- Users can request data deletion at any time
- No data is shared with third parties

## Updates

- Regular feature updates
- Security patches
- Performance improvements
- New payment methods

## Roadmap

- Additional stablecoin support
- Advanced reporting
- Custom payment workflows
- Integration with more CRMs

## License

Copyright © 2024 Banana Crystal. All rights reserved.
