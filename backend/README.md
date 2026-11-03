# Manoj Chitragar Portfolio - Backend API Daemon

A high-performance Express REST API daemon powering telemetry, contact form transmissions, and interactive terminal commands for the portfolio.

---

## 🛠️ API Endpoints

### 1. Health Check
- **`GET /api/health`**
- Returns server daemon health status.

### 2. Live Telemetry
- **`GET /api/telemetry`**
- Returns real-time host telemetry: CPU platform, memory (RSS / heap), uptime, Node version, and timestamps for the frontend HUD.

### 3. Contact Form Submission
- **`POST /api/contact`**
- Request Body:
  ```json
  {
    "name": "Elena Rostova",
    "email": "elena@acme.ai",
    "message": "Discuss systems architecture contract"
  }
  ```
- Returns transmission receipt ID and confirmation.
- **`GET /api/contact/transmissions`** — View received payloads.

### 4. Projects Matrix
- **`GET /api/projects`**
- Optional query: `?category=systems` | `?category=creative` | `?category=ai`
- Returns dynamic repository metadata and technology badges.

### 5. Interactive Terminal Remote Command
- **`POST /api/terminal/execute`**
- Request Body:
  ```json
  {
    "command": "status"
  }
  ```
- Returns formatted shell telemetry output.

---

## 🚀 Running the Backend

```bash
# Install dependencies
npm install

# Start in development mode (with auto-reload on file change)
npm run dev

# Start in production mode
npm start
```
Default Port: `http://localhost:5000`
