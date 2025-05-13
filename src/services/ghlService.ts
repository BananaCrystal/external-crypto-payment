import {
  GHL_CONFIG,
  GHL_ENDPOINTS,
  GHL_CUSTOM_FIELDS,
  GHL_TAGS,
  GHL_WEBHOOK_EVENTS,
} from "../config/ghlConfig";

interface GHLContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customField?: Record<string, any>;
  tags?: string[];
}

interface GHLTag {
  id: string;
  name: string;
}

interface GHLCustomField {
  id: string;
  name: string;
  type: string;
  options?: string[];
}

class GHLService {
  private apiKey: string;
  private locationId: string;
  private isTestMode: boolean;

  constructor(apiKey: string, locationId: string, isTestMode: boolean = false) {
    this.apiKey = apiKey;
    this.locationId = locationId;
    this.isTestMode = isTestMode;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const baseUrl = this.isTestMode
      ? GHL_CONFIG.test.apiBaseUrl
      : GHL_CONFIG.production.apiBaseUrl;
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("GHL API Error:", error);
        throw new Error(error.message || "GHL API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("GHL Service Error:", error);
      throw error;
    }
  }

  // Contact Management
  async createContact(contact: GHLContact) {
    console.log("Creating GHL contact:", contact);
    return this.request(GHL_ENDPOINTS.contacts, {
      method: "POST",
      body: JSON.stringify(contact),
    });
  }

  async updateContact(contactId: string, updates: Partial<GHLContact>) {
    console.log("Updating GHL contact:", { contactId, updates });
    return this.request(`${GHL_ENDPOINTS.contacts}/${contactId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async getContact(contactId: string) {
    return this.request(`${GHL_ENDPOINTS.contacts}/${contactId}`);
  }

  // Tag Management
  async addTag(contactId: string, tagName: string) {
    console.log("Adding tag to contact:", { contactId, tagName });
    return this.request(`${GHL_ENDPOINTS.contacts}/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags: [tagName] }),
    });
  }

  async removeTag(contactId: string, tagName: string) {
    console.log("Removing tag from contact:", { contactId, tagName });
    return this.request(`${GHL_ENDPOINTS.contacts}/${contactId}/tags`, {
      method: "DELETE",
      body: JSON.stringify({ tags: [tagName] }),
    });
  }

  async getTags(): Promise<GHLTag[]> {
    return this.request(GHL_ENDPOINTS.tags);
  }

  // Custom Fields Management
  async createCustomFields() {
    console.log("Creating GHL custom fields");
    const fields = Object.values(GHL_CUSTOM_FIELDS.payment);

    for (const field of fields) {
      await this.request(GHL_ENDPOINTS.customFields, {
        method: "POST",
        body: JSON.stringify(field),
      });
    }
  }

  async getCustomFields(): Promise<GHLCustomField[]> {
    return this.request(GHL_ENDPOINTS.customFields);
  }

  // Payment Status Management
  async updatePaymentStatus(
    contactId: string,
    status: string,
    transactionHash?: string
  ) {
    console.log("Updating payment status:", {
      contactId,
      status,
      transactionHash,
    });
    const updates: Partial<GHLContact> = {
      customField: {
        [GHL_CUSTOM_FIELDS.payment.paymentStatus.name]: status,
        ...(transactionHash && {
          [GHL_CUSTOM_FIELDS.payment.transactionHash.name]: transactionHash,
        }),
        [GHL_CUSTOM_FIELDS.payment.paymentDate.name]: new Date().toISOString(),
      },
    };

    // Update contact with payment status
    await this.updateContact(contactId, updates);

    // Update tags based on payment status
    const tagMap = {
      Pending: GHL_TAGS.payment.pending,
      Completed: GHL_TAGS.payment.completed,
      Failed: GHL_TAGS.payment.failed,
    };

    const newTag = tagMap[status as keyof typeof tagMap];
    if (newTag) {
      // Remove all payment status tags first
      await this.removeTag(contactId, GHL_TAGS.payment.completed);
      await this.removeTag(contactId, GHL_TAGS.payment.failed);
      await this.removeTag(contactId, GHL_TAGS.payment.pending);

      // Add the new status tag
      await this.addTag(contactId, newTag);
    }
  }

  // Webhook Handling
  async handleWebhook(event: string, data: any) {
    console.log("Handling GHL webhook:", { event, data });

    switch (event) {
      case GHL_WEBHOOK_EVENTS.contact.created:
      case GHL_WEBHOOK_EVENTS.contact.updated:
        // Handle contact updates
        break;
      case GHL_WEBHOOK_EVENTS.opportunity.created:
      case GHL_WEBHOOK_EVENTS.opportunity.updated:
        // Handle opportunity updates
        break;
      default:
        console.log("Unhandled webhook event:", event);
    }
  }
}

export default GHLService;
