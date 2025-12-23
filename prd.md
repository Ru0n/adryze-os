Adryze OS (Panc Bike Edition) - Implementation Guide & PRD
Version: 1.0
Status: Approved for Development
Target Stack: Next.js (App Router), Tailwind CSS (Shadcn/UI), Odoo 17 (XML-RPC), n8n (AI Middleware).
1. Executive Summary
Adryze OS is a custom "Headless" Frontend designed for Panc Bike. It serves as a modern, high-speed interface on top of the Odoo ERP.
It abstracts the complexity of Odoo's native backend, providing a simple, Apple-style dashboard for:
Unified Omnichannel Chat (WhatsApp, Instagram, Facebook).
Visual Inventory Management (AI Image Recognition).
Lead Management (CRM).
The system MUST be Real-Time (or near real-time) and support Full CRUD (Create, Read, Update, Delete) for inventory.
2. Technical Architecture
A. The Stack
Frontend: Next.js 14+ (App Router).
Styling: Tailwind CSS + Shadcn/UI (Mandatory for premium look).
State/Fetching: TanStack Query (React Query) or SWR (Critical for polling/real-time updates).
Backend Source: Odoo 17 Community (via XML-RPC API).
AI/Automation Middleware: n8n (Webhooks).
B. Data Flow
Auth: Next.js validates credentials against Odoo res.users.
Reads: Next.js fetches data directly from Odoo via XML-RPC.
Writes (Data): Next.js pushes updates to Odoo via XML-RPC.
Writes (Messages): Next.js sends outbound messages to an n8n Webhook, which handles the routing to WAHA/Meta.
Visual AI: Next.js uploads image to n8n Webhook -> n8n calls OpenAI/Gemini -> Returns JSON to Next.js.
3. Core Features & Requirements
FEATURE 1: Authentication (Odoo Proxy)
Requirement: The app must not have its own user database. It must use Odoo's users.
Login Page: Email & Password input.
Logic:
On Submit -> Server Action calls Odoo common.authenticate().
If UID returned -> Create Secure Session (use iron-session or next-auth).
Store uid, password (hashed or encrypted session), and user_context.
Restriction: Only users with specific Odoo groups (Sales/Inventory) can log in.
FEATURE 2: Unified Inbox (Interactive)
Requirement: A single view for WhatsApp, Instagram, and Messenger.
View: Kanban or Sidebar List (Like WhatsApp Web).
Real-Time Requirement: The interface must update automatically when a new message arrives.
Implementation Strategy: Use SWR/React Query with a polling interval of 2-3 seconds on the mail.message or discuss.channel model. (Simpler than setting up a custom WebSocket server for V1).
Interaction (Sending):
User types message -> Clicks Send.
Action: Call n8n Webhook (Payload: { channel, phone, message }). n8n handles the delivery via WAHA.
Optimistic UI: Show the message instantly in the chat window before confirmation.
FEATURE 3: Inventory "Google Lens" (Visual Search & CRUD)
Requirement: Manage products textually AND visually.
Visual Search:
Upload Image Button -> Sends to n8n Webhook.
n8n returns: { product_name: "Shimano 105", confidence: "High", sku: "S-105" }.
Frontend automatically filters the product list based on this response.
CRUD Operations:
Create: Form to add Product Name, Price, Stock, Barcode. (Writes to product.template).
Update: Click cell to edit Price/Stock inline.
Delete: (Soft delete/Archive only).
FEATURE 4: Action Center (CRM)
Requirement: Quick Lead Entry.
Quick Add Form:
Fields: Name (Required), Phone (Required), Source (Dropdown: Walk-in, Call), Notes.
Action: Creates crm.lead in Odoo.
Kanban View: Simple visualization of New vs. Won leads.
4. Implementation Steps (For the Developer)
Step 1: Project Initialization
Initialize Next.js: npx create-next-app@latest adryze-os --typescript --tailwind --eslint
Install Dependencies:
code
Bash
npm install xmlrpc shadcn-ui iron-session swr lucide-react
Setup Environment Variables (.env.local):
code
Env
ODOO_URL=https://erp.adryze.com
ODOO_DB=Panc_Demo
N8N_WEBHOOK_URL=https://n8n.adryze.com/webhook/...
SECRET_COOKIE_PASSWORD=...
Step 2: The XML-RPC Client (src/lib/odoo.ts)
Create a robust client to handle Odoo calls.
code
TypeScript
import xmlrpc from 'xmlrpc';

const client = xmlrpc.createSecureClient({
  host: 'erp.adryze.com',
  port: 443,
  path: '/xmlrpc/2/object'
});

export const odooCall = async (model: string, method: string, args: any[]) => {
  // Logic to execute_kw using stored credentials
  // Handle Errors gracefully
};
Step 3: Frontend Structure (Page by Page)
A. /login
Simple Card layout.
Authenticates against Odoo /common endpoint.
B. /dashboard/chat
Layout: Sidebar (Conversation List) + Main (Chat Window).
Data Fetch: Fetch mail.channel where channel_type is 'chat'.
Polling: Refresh list every 3s using SWR.
C. /dashboard/inventory
Layout: Data Table (use TanStack Table for sorting/filtering).
Visual Search Component: Drag-and-drop zone for images.
On drop -> POST to n8n -> setFilter(response.keyword).
Edit Modal: Clicking a row opens a Dialog to edit Price/Stock.
5. Critical Edge Cases & Rules
Rate Limiting: Do not spam Odoo API. React Query/SWR must handle caching.
Image Optimization: Resize images on the client side before sending to n8n to save bandwidth.
Error Handling: If Odoo is down, show a "Maintenance Mode" screen, don't crash.
Mobile Responsive: The Owner (Tirek) will check this on his phone. The Chat Interface MUST work perfectly on mobile.
6. Success Criteria (Definition of Done)
User can log in using Odoo credentials.
User can upload a photo of a bike part and see the correct stock count within 5 seconds.
User can send a WhatsApp message from the Dashboard, and it appears on the customer's phone.
User can change the price of a product, and it reflects in Odoo immediately.
Developer Note: Focus on the Inventory Visual Search first. That is the "Wow" factor for the demo. Chat is secondary priority for the V1 Demo.