# API Layer Overview

A lightweight guide to understanding and working with the API layer in this project.

---

## 🎯 Purpose

The `src/api` folder contains all code related to communicating with backend services. It provides:

- **Centralized HTTP client** configuration (base URL, headers, interceptors)
- **Automatic token management** (injection, refresh on 401)
- **Type-safe API functions** organized by domain
- **React hooks** that integrate with React Query for caching and state management
- **Route protection** logic that depends on authentication status

---

## 🛠️ Tools & Libraries

### **Axios** (`axios`)
HTTP client library used for all API requests. The configured instance includes:
- Base URL configuration
- Request/response interceptors
- Automatic error handling
- Cookie-based credentials

### **React Query** (`@tanstack/react-query`)
Server state management library that provides:
- Automatic caching of API responses
- Background refetching
- Loading and error states
- Optimistic updates for mutations

### **Interceptors**
Middleware functions that run before requests are sent and after responses are received:
- **Request interceptor**: Automatically attaches authentication tokens and language headers
- **Response interceptor**: Extracts data from response wrapper
- **Error interceptor**: Handles 401 errors by attempting token refresh

### **js-cookie** (`js-cookie`)
Used for storing and retrieving authentication tokens from browser cookies.

---

## 📁 Folder Structure & Responsibilities

```
src/api/
├── api.ts                 # Axios instance with interceptors
├── constants/             # Shared constants and keys
│   ├── api.constant.ts   # API-related constants (token names, headers)
│   └── apikeys.constant.ts # React Query cache keys
├── services/             # Domain-specific API functions
│   └── auth.ts          # Authentication-related API calls
├── hooks/                # React Query hooks for components
│   └── auth.ts          # useSignIn, useRefreshToken hooks
├── types/                # TypeScript type definitions
│   ├── api.ts           # Generic API response types
│   └── auth.ts          # Auth-specific request/response types
└── protected/            # Route protection component
    └── Protected.tsx     # Component that guards routes based on auth
```

### `api.ts`
**Purpose**: Configured Axios instance that all API calls use.

**What it does**:
- Configures default headers (Content-Type, Accept)
- Adds authentication token to every request automatically
- Adds language header from localStorage
- Handles 401 errors by refreshing tokens
- Queues failed requests during token refresh
- Redirects to login if refresh fails

**Key concept**: You don't call this directly in components. Use services instead.

### `constants/`
**Purpose**: Shared values used across the API layer.

- `api.constant.ts`: Cookie names, token types, header keys
- `apikeys.constant.ts`: React Query cache keys (prevents typos, ensures consistency)

### `services/`
**Purpose**: Pure API functions that make HTTP requests. Organized by domain/feature.

**Pattern**: Each service file exports an object with functions. Each function:
- Accepts typed parameters
- Returns a Promise with typed response
- Uses the configured `api` instance from `api.ts`

**Example structure**:
```typescript
const UserService = {
  getUser: (id: string): Promise<TAPIResponse<User>> => {
    return api.get(`/users/${id}`)
  },
  updateUser: (id: string, data: UpdateUserData): Promise<TAPIResponse<User>> => {
    return api.put(`/users/${id}`, data)
  }
}
```

### `hooks/`
**Purpose**: React hooks that wrap service functions with React Query.

**Pattern**: 
- Use `useQuery` for read operations (GET)
- Use `useMutation` for write operations (POST, PUT, DELETE)
- Handle side effects (navigation, cookie setting) in `onSuccess`/`onError`

**Example structure**:
```typescript
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: [ReactQueryKeys.USER, id],
    queryFn: () => UserService.getUser(id),
    enabled: !!id // Only run if id exists
  })
}
```

### `types/`
**Purpose**: TypeScript definitions for request payloads and responses.

- `api.ts`: Generic types like `TAPIResponse<T>` and `TPagination`
- Domain-specific files (e.g., `auth.ts`): Request/response types for that domain

**Key types**:
- `TAPIResponse<T>`: Standard API response wrapper with `status`, `message`, `data`
- `TAPIResponseItems<T>`: Response wrapper for paginated collections

### `protected/Protected.tsx`
**Purpose**: Route guard component that checks authentication before rendering children.

**What it does**:
- Uses `useRefreshToken` hook to validate session
- Redirects unauthenticated users to login
- Blocks authenticated users from accessing `/auth/*` pages
- Manages token storage in cookies

---

## 🚀 How to Use the API Layer

### Adding a New API Endpoint

**Step 1**: Define types in `types/` (if needed)
```typescript
// types/user.ts
export type User = {
  id: string
  name: string
  email: string
}

export type CreateUserData = {
  name: string
  email: string
}
```

**Step 2**: Add service function in `services/`
```typescript
// services/user.ts
import { TAPIResponse } from '../types/api'
import { User, CreateUserData } from '../types/user'
import api from '../api'

const UserService = {
  createUser: (data: CreateUserData): Promise<TAPIResponse<User>> => {
    return api.post('/users', data)
  }
}

export default UserService
```

**Step 3**: Create React Query hook in `hooks/`
```typescript
// hooks/user.ts
import { useMutation } from '@tanstack/react-query'
import UserService from '../services/user'
import ReactQueryKeys from '../constants/apikeys.constant'

export const useCreateUser = () => {
  return useMutation({
    mutationFn: UserService.createUser,
    mutationKey: [ReactQueryKeys.USER, 'create'],
    onSuccess: (data) => {
      // Handle success (navigate, show toast, etc.)
      console.log('User created:', data.data)
    }
  })
}
```

**Step 4**: Add React Query key to constants (if new domain)
```typescript
// constants/apikeys.constant.ts
const ReactQueryKeys = {
  // ... existing keys
  USER: "user"
}
```

**Step 5**: Use in component
```typescript
// In your component
import { useCreateUser } from '@/api/hooks/user'

function MyComponent() {
  const { mutate: createUser, isPending } = useCreateUser()

  const handleSubmit = () => {
    createUser({ name: 'John', email: 'john@example.com' })
  }

  return <button onClick={handleSubmit} disabled={isPending}>
    {isPending ? 'Creating...' : 'Create User'}
  </button>
}
```

---

## 🔄 Common Patterns

### Making a GET Request (Query)
```typescript
// Service
const getUsers = (): Promise<TAPIResponse<User[]>> => {
  return api.get('/users')
}

// Hook
export const useUsers = () => {
  return useQuery({
    queryKey: [ReactQueryKeys.USERS],
    queryFn: getUsers
  })
}

// Component usage
const { data, isLoading, error } = useUsers()
```

### Making a POST Request (Mutation)
```typescript
// Service
const createPost = (data: PostData): Promise<TAPIResponse<Post>> => {
  return api.post('/posts', data)
}

// Hook
export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
    mutationKey: [ReactQueryKeys.POST, 'create']
  })
}

// Component usage
const { mutate: createPost, isPending } = useCreatePost()
createPost({ title: 'Hello' })
```

### Using Pagination
```typescript
// Response type includes pagination
type UsersResponse = TAPIResponse<User[]>

// Service returns paginated data
const getUsers = (page: number): Promise<UsersResponse> => {
  return api.get(`/users?page=${page}`)
}

// Access pagination in component
const { data } = useUsers()
const pagination = data?.pagination // Has currentPage, totalPages, etc.
```

### Conditional Queries
```typescript
// Only run query if condition is met
export const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: [ReactQueryKeys.USER, userId],
    queryFn: () => UserService.getUser(userId!),
    enabled: !!userId // Won't run if userId is null
  })
}
```

---

## 🔐 Authentication Flow

The API layer handles authentication automatically:

1. **On every request**: Token is read from cookies and added to `Authorization` header
2. **On 401 response**: 
   - Automatically calls refresh token endpoint
   - Queues the failed request
   - Retries with new token after refresh
   - Redirects to login if refresh fails
3. **Token storage**: Access tokens stored in cookies with expiration
4. **Route protection**: `Protected` component validates token on mount

**You don't need to manually handle tokens** in most cases. The interceptors handle it.

---

## ✅ Best Practices

1. **Always use services, not the raw `api` instance** in components
2. **Create hooks for React Query** instead of calling services directly in components
3. **Define TypeScript types** for all requests and responses
4. **Use constants for query keys** to avoid typos and ensure cache consistency
5. **Handle side effects** (navigation, notifications) in hook `onSuccess`/`onError`, not in components
6. **Group related endpoints** in the same service file (e.g., all user-related APIs in `services/user.ts`)

---

## 🚫 What NOT to Do

- ❌ Don't import and use `api` directly in components or pages
- ❌ Don't create new Axios instances — use the configured one from `api.ts`
- ❌ Don't manually add Authorization headers — interceptors handle it
- ❌ Don't hardcode query keys — use constants from `apikeys.constant.ts`
- ❌ Don't skip TypeScript types — always define request/response shapes

---

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools) — Available in development mode
