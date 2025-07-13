# Vector-Based Recommendation Engine Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Docker and Docker Compose
- OpenAI API key

## Quick Start

### 1. Environment Setup

Copy the environment file and update the OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 2. Database Setup

Start PostgreSQL with PGVector using Docker:

```bash
docker-compose up -d
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start the Application

```bash
pnpm run start:dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Products
- `POST /products` - Create a product (with auto-vectorization)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID

### Orders
- `POST /orders` - Create an order
- `GET /orders` - Get all orders
- `GET /orders/user/:userId` - Get orders by user
- `GET /orders/user/:userId/history` - Get user order history
- `GET /orders/user/:userId/products` - Get user's ordered products summary

### Recommendations
- `POST /recommendations/user/:userId` - Get recommendations based on user's order history
- `POST /recommendations/preference` - Get recommendations based on text preference
- `POST /recommendations/hybrid/:userId` - Get hybrid recommendations (user + preference)

### Data Seeding
- `POST /seed/products?count=1000` - Generate test products (default: 1000)
- `POST /seed/orders?count=100000` - Generate test orders (default: 100,000)
- `POST /seed/all` - Generate both products and orders with default counts

## Usage Examples

### 1. Create a Product

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantName": "Joe'\''s Pizza",
    "productName": "Margherita Pizza",
    "description": "Classic pizza with fresh mozzarella, tomato sauce, and basil"
  }'
```

### 2. Create an Order

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "restaurantName": "Joe'\''s Pizza",
    "productName": "Margherita Pizza",
    "quantity": 2,
    "price": 15.99
  }'
```

### 3. Get User Recommendations

```bash
curl -X POST http://localhost:3000/recommendations/user/user_001 \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 5
  }'
```

### 4. Get Preference-Based Recommendations

```bash
curl -X POST http://localhost:3000/recommendations/preference \
  -H "Content-Type: application/json" \
  -d '{
    "preference": "spicy chicken with less cheese",
    "limit": 5
  }'
```

### 5. Seed Test Data

```bash
# Generate 1000 products
curl -X POST http://localhost:3000/seed/products?count=1000

# Generate 100,000 orders
curl -X POST http://localhost:3000/seed/orders?count=100000

# Or generate both with default counts
curl -X POST http://localhost:3000/seed/all
```

## Data Flow

1. **Products**: When created, product descriptions are vectorized using OpenAI embeddings and stored in PostgreSQL with PGVector
2. **Orders**: User orders are tracked and linked to products for recommendation generation
3. **Recommendations**: 
   - **User-based**: Analyzes user's order history to find similar products
   - **Preference-based**: Converts text preferences to vectors and finds matching products
   - **Hybrid**: Combines both approaches for better recommendations

## Development

### Running Tests

```bash
pnpm run test
```

### Building for Production

```bash
pnpm run build
pnpm run start:prod
```

### Database Management

The application uses TypeORM with `synchronize: true` for development. In production, you should:

1. Set `synchronize: false`
2. Use proper migrations
3. Set up proper database backups

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**: Make sure your `.env` file contains a valid OpenAI API key
2. **Database Connection Error**: Ensure Docker container is running with `docker-compose ps`
3. **Vector Extension Error**: The PGVector extension should be automatically enabled via `init.sql`

### Logs

The application provides detailed logging. Check the console output for debugging information.

### Performance Considerations

- Large dataset seeding (100,000 orders) may take several minutes
- OpenAI API has rate limits - the application includes built-in batching and delays
- Vector similarity searches are optimized with proper indexing