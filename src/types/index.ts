// TypeScript type definitions for Odoo models and API responses

export interface OdooUser {
  uid: number;
  name: string;
  email: string;
  groups?: string[];
}

export interface OdooProduct {
  id: number;
  name: string;
  default_code?: string; // SKU/Barcode
  list_price: number;
  qty_available: number;
  image_1920?: string;
}

export interface OdooLead {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  type: 'lead' | 'opportunity';
  stage_id: [number, string];
  user_id?: [number, string];
  description?: string;
  source_id?: [number, string];
  create_date: string;
}

export interface OdooChannel {
  id: number;
  name: string;
  channel_type: 'chat' | 'channel';
  channel_partner_ids: number[];
  message_unread_counter: number;
}

export interface OdooMessage {
  id: number;
  body: string;
  author_id: [number, string];
  date: string;
  message_type: 'notification' | 'comment' | 'email';
  model?: string;
  res_id?: number;
}

export interface VisualSearchResponse {
  product_name: string;
  confidence: 'High' | 'Medium' | 'Low';
  sku?: string;
  suggested_products?: string[];
}

export interface SessionData {
  uid: number;
  password: string; // Encrypted API key
  username: string;
  isLoggedIn: boolean;
}
