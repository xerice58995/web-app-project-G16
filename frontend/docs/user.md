### 🔹 API: `userSignUp`

**Description:**

- sign up

**Method:** `POST`
**Endpoint:** `/api/v1/users/signup`
**Content-Type:** `application/json`
**Request Body**

```json
{
    "email": "apple123@gmail.com",
    "password": "abc123456"
}
```
**Success Response:**

```json
{
  "code": 1,
  "message": "account successfully created"
}
```

**Failure Response:**

```json
{
  "code": 0,
  "message": "account failed to be created"
}
```

### 🔹 API: `userSignIn`

**Description:**

- sign in

**Method:** `POST`
**Endpoint:** `/api/v1/users/login`
**Content-Type:** `application/json`
**Request Body**

```json
{
    "email": "apple123@gmail.com",
    "password": "abc123456"
}
```
**Success Response:**

```json
{
  "data": {"userId":1},
  "code": 1,
  "message": "account successfully login",
}
```

**Failure Response:**

```json
{
  "data": {},
  "code": 0,
  "message": "account failed to be logic".
}
```