import { apiRequest } from '@/api/client'

function getData(response, action) {
  if (!response || !Object.hasOwn(response, 'data')) {
    throw new Error(`The server returned an invalid ${action} response.`)
  }
  return response.data
}

export async function register(values) {
  return getData(await apiRequest('/auth/register', { method: 'POST', body: values }), 'registration')
}

export async function verifyEmail(values) {
  return getData(await apiRequest('/auth/verify-email', { method: 'POST', body: values }), 'email verification')
}

export async function resendVerificationCode(email) {
  return getData(await apiRequest('/auth/resend-otp', {
    method: 'POST',
    body: { email },
  }), 'verification code')
}
