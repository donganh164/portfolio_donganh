import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Checks if the provided Supabase credentials are valid and not default placeholders.
 *
 * @param {string | undefined} url
 * @param {string | undefined} key
 * @returns {boolean}
 */
const checkIsValidCredentials = (url, key) => {
  if (!url || !key) return false
  if (typeof url !== 'string' || typeof key !== 'string') return false
  if (url.includes('your-project-ref') || key.includes('your-supabase-anon-key')) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const isSupabaseConfigured = checkIsValidCredentials(supabaseUrl, supabaseAnonKey)

/**
 * Creates a recursive Mock Proxy to simulate Supabase Client API when credentials are not configured.
 * This prevents runtime fatal errors (White Screen of Death) when running local dev without DB setup.
 *
 * @returns {any}
 */
function createMockSupabaseClient() {
  let hasWarned = false

  const logMockWarning = () => {
    if (!hasWarned && typeof console !== 'undefined') {
      console.warn(
        '%c[Supabase]%c Đang chạy ở chế độ Mock Adapter do chưa điền thông tin trong file .env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).',
        'color: #3ecf8e; font-weight: bold;',
        'color: inherit;'
      )
      hasWarned = true
    }
  }

  const createChainableHandler = () => {
    const defaultResponse = { data: [], error: null, count: 0 }

    const handler = {
      get(target, prop) {
        logMockWarning()

        // Handle Promise resolution (then/catch)
        if (prop === 'then') {
          return (resolve) => resolve(defaultResponse)
        }
        if (prop === 'catch') {
          return () => Promise.resolve(defaultResponse)
        }

        // Special mock handlers for auth events
        if (prop === 'onAuthStateChange') {
          return () => ({
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
          })
        }

        // Return a proxy function that can be called repeatedly or awaited
        return (..._args) => new Proxy(() => {}, handler)
      },
      apply() {
        return new Proxy(() => {}, handler)
      },
    }

    return new Proxy(() => {}, handler)
  }

  return createChainableHandler()
}

/**
 * Singleton Supabase Client instance with automatic fallback.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createMockSupabaseClient()

/**
 * Helper to check connection health with Supabase backend.
 *
 * @returns {Promise<{ isConnected: boolean, message: string }>}
 */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return {
      isConnected: false,
      message: 'Chưa cấu hình VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong file .env.',
    }
  }

  try {
    // Attempt lightweight ping to verify connection
    const { error } = await supabase.from('profiles').select('id').limit(1)
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, connection is still alive
      return {
        isConnected: true,
        message: `Đã kết nối thành công với Supabase (${error.message || 'Chưa khởi tạo bảng'}).`,
      }
    }
    return {
      isConnected: true,
      message: 'Kết nối Supabase hoạt động tốt.',
    }
  } catch (err) {
    return {
      isConnected: false,
      message: `Lỗi kết nối Supabase: ${err.message}`,
    }
  }
}
