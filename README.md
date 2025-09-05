# How to Integrate Authentication & Data Endpoints (Frontend Guide)

> This guide summarizes how to make POST and GET requests to typical authentication and protected data endpoints, based on real codebase and API documentation patterns. See below for practical frontend (JS/fetch/axios) usage.  
> **Note:** Always check the actual backend for the latest field names and error handling.

---

## Authentication Endpoints

### 1. Sign Up

**Endpoint:** `POST /auth/signup`  
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Frontend Example (fetch):**
```js
fetch('/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
  .then(res => res.json())
  .then(data => {
    // Save JWT token to localStorage for future requests
    localStorage.setItem('token', data.token);
  });
```

**Frontend Example (axios):**
```js
import axios from 'axios';
axios.post('/auth/signup', { email, password })
  .then(res => {
    localStorage.setItem('token', res.data.token);
  });
```

---

### 2. Login

**Endpoint:** `POST /auth/login`  
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Frontend Example:**
```js
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('token', data.token);
  });
```

---

## Authenticated Requests

Most protected endpoints require an `Authorization: Bearer <token>` header.

**Example:**
```js
const token = localStorage.getItem('token');
fetch('/protected-endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

Or with axios:
```js
axios.get('/protected-endpoint', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## Example Data Endpoints

### GET: Get Fish Details

**Endpoint:** `GET /fishes/:id`  
**Headers:**  
`Authorization: Bearer <token>`

**Frontend Example:**
```js
const token = localStorage.getItem('token');
fetch(`/fishes/${fishId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    // handle fish details
  });
```

### GET: Search Fishes

**Endpoint:** `GET /fishes/search?query=...&filters=...`  
**Headers:**  
`Authorization: Bearer <token>`

**Frontend Example:**
```js
const token = localStorage.getItem('token');
const params = new URLSearchParams({ query: 'goldfish', filters: '{}' }).toString();
fetch(`/fishes/search?${params}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => {
    // handle search results
  });
```

---

### POST: Create Fish Listing

**Endpoint:** `POST /fishes`  
**Headers:**  
`Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "name": "string",
  "species": "string",
  "variant": "string",
  "age": 12,
  "size": 10.5,
  "grade": "A",
  "price": 100,
  "imageUrl": "http://...",
  "videoUrl": "...",
  "description": "...",
  "origin": "...",
  "gender": "...",
  "certificate": "..."
}
```
**Frontend Example:**
```js
const token = localStorage.getItem('token');
fetch('/fishes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(fishData)
})
  .then(res => res.json())
  .then(data => {
    // handle new fish creation
  });
```

---

### POST: Add Fish Certificate

**Endpoint:** `POST /fishes/:id/certificate`  
**Headers:**  
`Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "certificateType": "string",
  "issuer": "string",
  "date": "YYYY-MM-DD",
  "details": "string"
}
```
**Frontend Example:**
```js
const token = localStorage.getItem('token');
fetch(`/fishes/${fishId}/certificate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(certificateData)
})
  .then(res => res.json())
  .then(data => {
    // handle certificate response
  });
```

---

## Error Handling

- **401 Unauthorized:** Token invalid or missing. Redirect to login or show error.
- **403 Forbidden:** Permission denied. Show error to user.
- **404 Not Found:** Resource not found.
- **400 Bad Request:** Validation failed (check API docs for required fields).
- **500 Internal Server Error:** Server error.

---

## Notes

- Always send the Authorization header for protected endpoints.
- Store tokens securely (localStorage/sessionStorage).
- Backend may return errors in different formats; always check `res.status` and handle errors accordingly.

---

## Quick Axios Setup (Global Authorization Header)

```js
import axios from 'axios';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

**For more details, check the backend repo for latest field names and error formats. Results above are based on code and doc search; not all endpoints may be listed.**