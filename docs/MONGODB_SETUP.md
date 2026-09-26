# MongoDB Atlas Setup Guide

Follow these steps to connect your local app to a free MongoDB database.

## 1. Create an Atlas account

Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up (free tier).

## 2. Create a free cluster

- Click **Build a Database** → choose **M0 FREE**
- Pick a region close to you (e.g. **AWS / Mumbai (ap-south-1)**)
- Name your cluster (default is fine)

## 3. Create a database user

- **Database Access** → **Add New Database User**
- Choose **Password** authentication
- Save the username and password — you need them for the connection string

## 4. Allow network access

- **Network Access** → **Add IP Address**
- For local dev: **Add Current IP Address**
- For quick testing only: `0.0.0.0/0` (allows any IP — less secure, avoid in production)

## 5. Get your connection string

- **Database** → **Connect** → **Drivers**
- Copy the connection string (looks like `mongodb+srv://...`)
- Replace `<password>` with your user's password
- Replace `<dbname>` with a database name, e.g. `house-of-edtech`

## 6. Add to `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI="mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/house-of-edtech?retryWrites=true&w=majority"
```

## 7. Verify the connection

```bash
npm run dev
curl http://localhost:3000/api/health/db
```

Expected response:

```json
{ "connected": true, "count": 0 }
```

If you see `"connected": false`, double-check username, password, IP whitelist, and that `.env.local` exists.
