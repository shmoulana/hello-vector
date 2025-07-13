# Hello Vector 🚀

A powerful vector-based recommendation engine built with NestJS, PostgreSQL with PGVector, and OpenAI embeddings. This application demonstrates how to build intelligent food recommendation systems using modern vector similarity search.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/openai-%23412991.svg?style=for-the-badge&logo=openai&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 🌟 Features

- **Vector-Powered Recommendations**: Uses OpenAI embeddings and PGVector for similarity search
- **Multiple Recommendation Types**:
  - 📊 User-based (order history analysis)
  - 💬 Preference-based (natural language: "spicy chicken with less cheese")
  - 🔄 Hybrid (combines both approaches)
- **Auto-Vectorization**: Products are automatically converted to vectors on creation
- **Scalable Architecture**: Built with NestJS modules and TypeORM
- **Test Data Generation**: Scripts to generate 1,000 products and 100,000 orders
- **Docker Ready**: PostgreSQL with PGVector extension included

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Products      │    │   Orders         │    │ Recommendations │
│                 │    │                  │    │                 │
│ • Auto-vectorize│    │ • User tracking  │    │ • User-based    │
│ • CRUD ops      │    │ • Order history  │    │ • Preference    │
│ • Similarity    │    │ • Analytics      │    │ • Hybrid        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                    ┌─────────────────────────┐
                    │    PostgreSQL           │
                    │    + PGVector           │
                    │                         │
                    │ • Vector storage        │
                    │ • Similarity search     │
                    │ • ACID compliance       │
                    └─────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker & Docker Compose
- OpenAI API Key

### 1. Clone and Setup

```bash
git clone https://github.com/shmoulana/hello-vector.git
cd hello-vector
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Database

```bash
docker-compose up -d
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Start Application

```bash
pnpm run start:dev
```

🎉 **Application running at:** `http://localhost:3000`

## 📡 API Endpoints

### Products
```http
POST /products              # Create product (auto-vectorized)
GET  /products              # Get all products
GET  /products/:id          # Get product by ID
```

### Orders
```http
POST /orders                # Create order
GET  /orders/user/:userId   # Get user orders
GET  /orders/user/:userId/history  # Get order history
```

### Recommendations
```http
POST /recommendations/user/:userId        # User-based recommendations
POST /recommendations/preference          # Preference-based recommendations
POST /recommendations/hybrid/:userId      # Hybrid recommendations
```

### Test Data
```http
POST /seed/products?count=1000           # Generate test products
POST /seed/orders?count=100000           # Generate test orders
POST /seed/all                           # Generate both
```

## 💡 Usage Examples

### Create a Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantName": "Mario'\''s Pizza",
    "productName": "Spicy Margherita",
    "description": "Wood-fired pizza with spicy tomato sauce, fresh mozzarella, and basil"
  }'
```

### Get Preference-Based Recommendations
```bash
curl -X POST http://localhost:3000/recommendations/preference \
  -H "Content-Type: application/json" \
  -d '{
    "preference": "less spicy chicken with extra cheese",
    "limit": 5
  }'
```

### Seed Test Data
```bash
curl -X POST http://localhost:3000/seed/all
```

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend** | NestJS | API framework with TypeScript |
| **Database** | PostgreSQL + PGVector | Vector storage and similarity search |
| **Embeddings** | OpenAI API | Text-to-vector conversion |
| **ORM** | TypeORM | Database operations and migrations |
| **Validation** | class-validator | Request validation |
| **Containerization** | Docker | Database deployment |

## 📊 Data Models

### Product
```typescript
{
  id: number
  restaurantName: string
  productName: string
  description: string
  embeddingVector: number[]  // 1536-dimensional OpenAI embedding
  createdAt: Date
}
```

### Order
```typescript
{
  id: number
  userId: string
  restaurantName: string
  productName: string
  quantity: number
  price: number
  createdAt: Date
}
```

## 🔍 How Recommendations Work

### 1. User-Based Recommendations
- Analyzes user's order history
- Creates preference profile from ordered products
- Finds similar products using vector similarity
- Filters out already ordered items

### 2. Preference-Based Recommendations
- Converts natural language preferences to vectors
- Performs similarity search against product embeddings
- Returns best matches with similarity scores

### 3. Hybrid Recommendations
- Combines user history (70% weight) and preferences (30% weight)
- Removes duplicates and ranks by combined score
- Provides most comprehensive recommendations

## 🧪 Development

### Run Tests
```bash
pnpm run test          # Unit tests
pnpm run test:e2e      # End-to-end tests
pnpm run test:cov      # Coverage report
```

### Code Quality
```bash
pnpm run lint          # ESLint
pnpm run format        # Prettier
```

### Build for Production
```bash
pnpm run build
pnpm run start:prod
```

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Detailed setup instructions and troubleshooting
- **[Developer Guide](./CLAUDE.md)** - Architecture and development notes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is [MIT licensed](LICENSE).

## 🔗 Related Projects

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [PGVector](https://github.com/pgvector/pgvector) - Vector similarity search for PostgreSQL
- [OpenAI](https://openai.com/) - AI embeddings and language models

---

<p align="center">
  <strong>Built with ❤️ using modern vector search technology</strong>
</p>