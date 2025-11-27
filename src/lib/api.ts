
import axios from "axios";

/**
 * Get the backend API base URL dynamically based on the current domain
 * Supports both codecafelab.in and admin.codecafelab.in domains
 * 
 * @param hostname - Optional hostname from request headers (for server-side usage)
 */
export function getBackendApiUrl(hostname?: string): string {
  // Check for explicit environment variable first (highest priority)
  if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_API_URL;
  }

  // Always check for development mode first (works for both server and client)
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    return "http://localhost:9002/api";
  }

  // Use provided hostname (from request headers) or detect from window
  let detectedHostname = hostname;
  if (!detectedHostname && typeof window !== 'undefined') {
    detectedHostname = window.location.hostname;
  }

  // If we have a hostname (either from request or window)
  if (detectedHostname) {
    
    // Development - check localhost in any case
    if (detectedHostname === 'localhost' || detectedHostname === '127.0.0.1' || 
        detectedHostname.startsWith('localhost:') || detectedHostname.startsWith('127.0.0.1:')) {
      return "http://localhost:9002/api";
    }
    
    // Production: Determine backend URL based on frontend domain
    // If frontend is on codecafelab.in, backend is on admin.codecafelab.in
    // If frontend is on admin.codecafelab.in, backend is on the same domain
    if (detectedHostname === 'codecafelab.in' || detectedHostname === 'www.codecafelab.in') {
      return "https://admin.codecafelab.in/api";
    }
    
    // If already on admin domain, use the same domain
    if (detectedHostname === 'admin.codecafelab.in' || detectedHostname === 'www.admin.codecafelab.in' || 
        detectedHostname === 'adminb.codecafelab.in' || detectedHostname === 'www.adminb.codecafelab.in') {
      return `https://${detectedHostname}/api`;
    }
  }

  // Server-side production fallback
  return "https://admin.codecafelab.in/api";
}

const apiBaseUrl = getBackendApiUrl();

// Log the API base URL for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development Mode:', process.env.NODE_ENV === 'development');
  console.log('🔗 API Base URL:', apiBaseUrl);
  console.log('🌍 Environment variable NEXT_PUBLIC_BACKEND_API_URL:', process.env.NEXT_PUBLIC_BACKEND_API_URL);
  if (typeof window !== 'undefined') {
    console.log('🏠 Window hostname:', window.location.hostname);
  }
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 second timeout for file uploads
});

/**
 * Create a dynamic API client for server-side routes
 * Use this in Next.js API routes to get the correct backend URL based on request headers
 * 
 * @param hostname - Hostname from request headers (e.g., from req.headers.get('host'))
 * @returns Axios instance configured with the correct backend URL
 */
export function createApiClient(hostname?: string) {
  const backendUrl = getBackendApiUrl(hostname);
  return axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
  });
}

// apiClient.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("authToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    const errorInfo: any = {
      message: error.message || 'Unknown error',
      code: error.code || 'UNKNOWN',
    };
    
    if (error.config) {
      errorInfo.config = {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
        fullUrl: `${error.config.baseURL}${error.config.url}`
      };
    }
    
    if (error.response) {
      errorInfo.response = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
    } else {
      errorInfo.response = 'No response received';
      // Network errors, CORS issues, or timeout errors
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorInfo.networkError = true;
        errorInfo.suggestion = 'Check if the backend server is running and accessible';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorInfo.timeoutError = true;
        errorInfo.suggestion = `Backend server on ${error.config?.baseURL || 'port 9002'} is not responding. Please ensure the backend is running.`;
      }
    }
    
    // Only log detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorInfo);
      if (errorInfo.timeoutError || errorInfo.networkError) {
        console.warn(`⚠️ Backend connection issue. Make sure backend is running on ${error.config?.baseURL || 'http://localhost:9002/api'}`);
      }
    }

    return Promise.reject(error);
  }
);

export const getProducts = () => apiClient.get("/products");
export const getProduct = (id: string) => apiClient.get(`/products/${id}`);
export const getPartners = () => apiClient.get("/partners");
export const getPartner = (id: string) => apiClient.get(`/partners/${id}`);

export const createPartnerRequest = (partnerData: FormData) => {
  return apiClient.post('/partners', partnerData);
};



export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export interface Career {
  id?: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience_level: "entry" | "mid" | "senior" | "lead";
  salary_min?: number;
  salary_max?: number;
  department: string;
  tags?: string[];
  status: "active" | "inactive" | "draft";
  featured: boolean;
  views: number;
  applications_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface JobApplication {
  id?: string;
  job_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  experience_years?: number;
  current_company?: string;
  current_position?: string;
  expected_salary?: number;
  notice_period?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  notes?: string;
  job_title?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  position: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  certifications?: string[];
  status: 'active' | 'inactive';
  featured: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}
