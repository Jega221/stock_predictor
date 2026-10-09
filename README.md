# 📈 AI Stock Predictor & Quantitative Analytics Platform

A high-performance, real-time financial market intelligence platform combining **OpenAI GPT intelligence**, **Polygon.io tick/OHLC aggregations**, and an internal **Quantitative Technical Momentum Engine**.

Built with modern React 19, Vite, Tailwind CSS v4, and interactive motion graphics, and containerized with a production multi-stage Docker + Nginx architecture.

---

## ✨ Features

- **Real-Time Market Aggregation**: Fetches previous close and intraday candlestick data from Polygon.io.
- **AI-Powered Technical Reports**: Synthesizes market momentum, support/resistance levels, and buy/hold/sell recommendations using OpenAI GPT.
- **Autonomous Quantitative Fallback Engine**: Proprietary client/server momentum and volatility calculator that ensures uninterrupted uptime even if API quotas are exhausted.
- **Interactive Ticker Grid**: Dynamic canvas with fluid particle physics, hover trail effects, and unfolding real-time quote chips.
- **Modern Fintech Aesthetics**: Dark mode interface designed with glassmorphism, responsive micro-animations, and fluid typography.
- **Enterprise Containerization**: Multi-stage Docker build utilizing Alpine Linux and Nginx for an ultra-lightweight (<40MB) production image.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| **Backend & Serverless** | Netlify Functions, Vite Plugin API Server |
| **Market Data & AI** | Polygon.io API, OpenAI GPT-3.5/GPT-4 |
| **DevOps & Container** | Docker (Multi-stage build), Nginx Alpine |
| **Deployment** | Netlify |

---

## 🐳 Quickstart with Docker

You can pull and run the pre-built production container from Docker Hub in seconds:

```bash
# 1. Pull the image from Docker Hub
docker pull jegabig/ai-stock-predictor:latest

# 2. Run the container
docker run -d -p 8080:80 --name stock-app jegabig/ai-stock-predictor:latest
```

Open your browser at **[http://localhost:8080](http://localhost:8080)** to view the app!

### Stop or remove the container:
```bash
# Stop
docker stop stock-app

# Remove
docker rm stock-app
```

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
# 1. Clone the repository
git clone https://github.com/Jega221/stock_predictor.git
cd stock_predictor

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
POLYGON_API_KEY=your_polygon_api_key
OPENAI_API_KEY=your_openai_api_key

# 4. Start local development server
npm run dev
```

### Build for Production Locally:
```bash
npm run build
npm run preview
```

### Build the Docker Image Locally:
```bash
docker build -t ai-stock-predictor .
docker run -d -p 8080:80 ai-stock-predictor
```

---

## 📄 License
MIT © [Abubakar Sani Jega](https://github.com/Jega221)
