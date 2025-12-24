# Adryze OS (Headless Odoo Frontend)

Adryze OS is a modern, high-speed "Headless" Frontend for Odoo ERP, built with Next.js 14+ (App Router). It abstracts the complexity of Odoo's backend, providing a premium, Apple-style dashboard for:
- 💬 **Unified Omnichannel Chat** (WhatsApp, Instagram, Messenger)
- 📸 **Visual chat Management** (AI-powered "Google Lens" for products)
- 🚀 **CRM & Lead Management**

## 🛠 Tech Stack
- **Frontend Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 + Shadcn/UI
- **Backend Source:** Odoo 17 Community (via XML-RPC)
- **AI Middleware:** n8n (for visual search & message routing)
- **Database:** Supabase (for additional application state)

## 🚀 Getting Started

Follow these instructions to set up the project on macOS or Windows.

### Prerequisites
- **Node.js** 18+ installed
- **Python** 3.8+ (for data seeding scripts)
- **Odoo 17** instance running (Local or Cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/Ru0n/adryze-os.git
cd adryze-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following variables:

```env
# Odoo Connection
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name

# n8n Webhooks (for AI & Messaging)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...

# Security
SECRET_COOKIE_PASSWORD=complex_password_at_least_32_characters_long

# Supabase (Optional, if using Supabase features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Access the app at [http://localhost:3000](http://localhost:3000).

---

## 🐍 Python Data Seeding (Optional)

We provide a Python script (`test.py`) to seed demo data (products with AI tags) into your Odoo instance.

#### macOS / Linux
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install requests

# Run the seed script
python3 test.py
```

#### Windows (PowerShell)
```powershell
# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate

# Install requirements
pip install requests

# Run the seed script
python test.py
```

*Note: You may need to edit `test.py` to update the Odoo credentials (`url`, `db`, `username`, `password`) before running it.*

## 📂 Project Structure
- **/app**: Next.js App Router pages & API routes.
- **/src/components**: React components (UI, Dashboard, Chat).
- **/src/lib**: Utility libraries (Odoo XML-RPC client, Supabase client).
- **/public**: Static assets.

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
