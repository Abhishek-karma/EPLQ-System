
# **EPLQ - Efficient Privacy-Preserving Location Query System**

🌐 **Live Demo**: [https://eplq-system-bkuf.vercel.app/](https://eplq-system-bkuf.vercel.app/)

![EPLQ Architecture](https://via.placeholder.com/800x400.png?text=EPLQ+System+Architecture)

A secure location-based query system with encrypted geospatial data storage and retrieval.

## Features

- 🔒 **AES-256 Encrypted Location Storage**
- 🌍 **Geohash-based Spatial Queries**
- 🛡️ **Role-Based Access Control (Admin/User)**
- 📍 **Privacy-Preserving Search Algorithm**
- 📊 **MongoDB Geospatial Indexing**
- 📱 **Responsive React Frontend**

## Technologies

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster

### Clone the repository

```bash
git clone https://github.com/yourusername/eplq-system.git
cd eplq-system


### Install Backend and Frontend Dependencies

1. **Backend Setup**:
   ```bash
   cd eplq-backend
   npm install
   ```

2. **Frontend Setup**:
   ```bash
   cd ../eplq-frontend
   npm install
   ```

### Start Development Servers

1. **Start Backend**:
   In a separate terminal window, run:
   ```bash
   cd eplq-backend
   npm run dev
   ```

2. **Start Frontend**:
   In another terminal window, run:
   ```bash
   cd eplq-frontend
   npm run dev
   ```

## Configuration

### Backend (eplq-backend/.env)
Create a `.env` file in the `eplq-backend` directory and add the following environment variables:

```ini
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eplq
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=32_character_encryption_key
```

### Frontend (eplq-frontend/.env)
Create a `.env` file in the `eplq-frontend` directory and add the following environment variable:

```ini
VITE_API_BASE_URL=http://localhost:4000/api
```

## API Endpoints

| Endpoint          | Method | Description                |
|-------------------|--------|----------------------------|
| /api/auth/login   | POST   | User authentication        |
| /api/poi          | POST   | Create new POI (Admin)     |
| /api/poi/search   | POST   | Search POIs                |
| /api/users        | GET    | Get users (Admin)          |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT License - See [LICENSE](LICENSE) for details
```
