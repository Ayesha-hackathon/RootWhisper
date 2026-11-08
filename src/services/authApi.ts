/**
 * RootWhisper Real User Authentication Service.
 * Manages user registration, credential verification, JWT sessions, and password recovery.
 */

import { APP_CONFIG } from '../config/appConfig';

export interface AuthUser {
  id: number;
  email: str;
  full_name: str;
  is_active: boolean;
  created_at?: string | null;
  last_login?: string | null;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

const TOKEN_KEY = 'rootwhisper_auth_token';
const USER_KEY = 'rootwhisper_auth_user';

export const authApi = {
  /**
   * Retrieves the stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Retrieves the stored user profile.
   */
  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Persists session token and user profile.
   */
  setSession(token: string, user: AuthUser, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Clears session storage.
   */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  /**
   * Authenticates an existing human user.
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthTokenResponse> {
    const res = await fetch(`${APP_CONFIG.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed. Please check your credentials.' }));
      throw new Error(err.detail || `Login error (${res.status})`);
    }

    const data: AuthTokenResponse = await res.json();
    this.setSession(data.access_token, data.user, rememberMe);
    return data;
  },

  /**
   * Registers a new human user with Argon2id password hashing on backend.
   */
  async register(fullName: string, email: string, password: string, confirmPassword: string): Promise<AuthTokenResponse> {
    const res = await fetch(`${APP_CONFIG.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed.' }));
      throw new Error(err.detail || `Registration error (${res.status})`);
    }

    const data: AuthTokenResponse = await res.json();
    this.setSession(data.access_token, data.user, false);
    return data;
  },

  /**
   * Retrieves profile of currently authenticated user.
   */
  async getMe(): Promise<AuthUser | null> {
    const token = this.getToken();
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${APP_CONFIG.apiUrl}/auth/me`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!res.ok) {
        this.clearSession();
        return null;
      }

      const user: AuthUser = await res.json();
      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  },

  /**
   * Logs out user and invalidates session.
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      await fetch(`${APP_CONFIG.apiUrl}/auth/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
    } finally {
      this.clearSession();
    }
  },

  /**
   * Submits a password reset request. Dispatches link via Gmail SMTP.
   */
  async forgotPassword(email: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${APP_CONFIG.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Password recovery request failed.' }));
      throw new Error(err.detail || `Error (${res.status})`);
    }

    return await res.json();
  },

  /**
   * Verifies that a password recovery token from email URL is valid, active, and unexpired.
   */
  async verifyResetToken(token: string): Promise<{ status: string; message: string; user_email_masked?: string }> {
    const res = await fetch(`${APP_CONFIG.apiUrl}/auth/verify-reset-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'The recovery token is invalid, expired, or has already been used.' }));
      throw new Error(err.detail || `Error (${res.status})`);
    }

    return await res.json();
  },

  /**
   * Resets password using single-use token.
   */
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${APP_CONFIG.apiUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to reset password.' }));
      throw new Error(err.detail || `Error (${res.status})`);
    }

    return await res.json();
  },
};

