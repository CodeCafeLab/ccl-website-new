
import axios from "axios";

// Force localhost for development to avoid CORS issues
const isDevelopment = process.env.NODE_ENV === 'development' || typeof window !== 'undefined' && window.location.hostname === 'localhost';
const apiBaseUrl = isDevelopment ? "http://localhost:5000/api" : (process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api");

// Log the API base URL for debugging
console.log('🔧 Development Mode:', isDevelopment);
console.log('🔗 API Base URL:', apiBaseUrl);
console.log('🌍 Environment variable NEXT_PUBLIC_BACKEND_API_URL:', process.env.NEXT_PUBLIC_BACKEND_API_URL);
console.log('🏠 Window hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');

if (!apiBaseUrl) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not set in the environment variables.");
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 second timeout for file uploads
});

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
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });

    // // Handle specific error cases
    // if (error.code === 'ERR_NETWORK') {
    //   console.error('Network Error: Check if backend server is running on', apiBaseUrl);
    // }

    // if (typeof window !== "undefined" && error.response && error.response.status === 401) {
    //   localStorage.removeItem("authToken");
    //   window.location.href = "/login";
    // }

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
