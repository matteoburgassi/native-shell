import type { User } from './types';
import { getConfig } from '../config';

function basicAuthHeader(): string {
  const cfg = getConfig();
  return 'Basic ' + btoa(`${cfg.authLogin}:${cfg.authSecret}`);
}

function hexEncode(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha1(data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new Uint8Array(data));
  return hexEncode(buf);
}

const SALT = 'f5c028c81f560e6cd05c8513b96062b0';
const SALT_PREFIX = SALT.slice(0, 10);
const SALT_SUFFIX = SALT.slice(10, 32);

/**
 * Replicates the Android `dvHash` password hashing.
 * hash = SHA1(salt[0..10] + password + salt[10..32])
 */
export async function dvHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const prefix = encoder.encode(SALT_PREFIX);
  const pwd = encoder.encode(password);
  const suffix = encoder.encode(SALT_SUFFIX);

  const combined = new Uint8Array(prefix.length + pwd.length + suffix.length);
  combined.set(prefix, 0);
  combined.set(pwd, prefix.length);
  combined.set(suffix, prefix.length + pwd.length);

  return sha1(combined);
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const cfg = getConfig();
  const hashedPassword = await dvHash(password);

  const params = new URLSearchParams({
    service_id: cfg.serviceId,
    login: email,
    password_dve: hashedPassword,
  });

  const res = await fetch(`${cfg.authHost}/login/dve?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuthHeader(),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Login failed (${res.status})`);
  }

  const json = await res.json();

  if (json.error === 1 || !json.data?.user_id) {
    throw new Error(json.message || 'Invalid credentials');
  }

  const userId = String(json.data.user_id);
  const accountInfo = await fetchAccountInfo(userId);

  return {
    id: userId,
    email: accountInfo.email ?? email,
    firstname: accountInfo.firstname,
    lastname: accountInfo.lastname,
    subscribed: accountInfo.subscribed ?? false,
    token: json.data.userdve_ticket ?? accountInfo.token,
  };
}

export async function fetchAccountInfo(userId: string): Promise<Partial<User>> {
  const cfg = getConfig();

  const params = new URLSearchParams({
    user_id: userId,
    service_id: cfg.serviceId,
    force_cache: '1',
  });

  const res = await fetch(`${cfg.authHost}/accountinfo/all?${params}`, {
    headers: { 'Authorization': basicAuthHeader() },
  });

  if (!res.ok) return {};

  const json = await res.json();
  const data = json.data?.userData ?? json.data ?? json;

  return {
    email: data.email,
    msisdn: data.msisdn,
    firstname: data.firstname,
    lastname: data.lastname,
    subscribed: data.subscribed ?? false,
    token: data.token,
  };
}

export async function deliveryOrder(
  userId: string,
  contentRef: number,
  orderType = 1,
): Promise<{ orderId: string } | null> {
  const cfg = getConfig();

  const params = new URLSearchParams({
    user_id: userId,
    service_id: cfg.serviceId,
    content_ref: String(contentRef),
    order_type: String(orderType),
  });

  const res = await fetch(`${cfg.authHost}/delivery/order?${params}`, {
    headers: { 'Authorization': basicAuthHeader() },
  });

  if (!res.ok) return null;

  const json = await res.json();
  const orderId = json.data?.do_id;
  return orderId ? { orderId: String(orderId) } : null;
}
