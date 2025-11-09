# HackUTD25 Backend (Supabase)

Minimal Node/Express backend that uses Supabase as a database.

Setup
1. Copy `.env.example` to `.env` and fill in your Supabase project URL and key.
2. Install dependencies:

   npm install

3. Start the server in development:

   npm run dev

Available endpoints
- GET /api/health — simple health check
- GET /api/reports — list reports (paginated simple)
- POST /api/reports — create a new report (body: title, description, lat, lng, severity)
- GET /api/status — returns summary counts
- GET /api/chat/history — get recent chat messages
- POST /api/chat/message — send a new message (body: message, userId)

Database Setup (Supabase)
1. Go to your Supabase project's SQL editor
2. Run the SQL migrations in order:
   - `migrations/001_create_reports_table.sql`
   - `migrations/002_create_chat_messages_table.sql`

These will create:
- `reports` table for problem reports
- `chat_messages` table for the chat feature
- Sample test data for verification
