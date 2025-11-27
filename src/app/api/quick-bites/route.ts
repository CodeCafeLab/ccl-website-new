import { NextResponse, NextRequest } from "next/server";
import { createApiClient } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    // Get hostname from request headers for proper domain detection
    const hostname = req.headers.get('host')?.split(':')[0];
    
    // Create a dynamic API client that works with both domains
    const apiClient = createApiClient(hostname);
    
    console.log(`[quick-bites] Fetching from backend, hostname: ${hostname}`);
    console.log(`[quick-bites] Backend URL: ${apiClient.defaults.baseURL}`);
    
    const res = await apiClient.get(`/quick-bites`);

    if (res.status !== 200) {
      throw new Error(`Failed to fetch quick bites: ${res.statusText}`);
    }
    
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("API Error fetching quick bites:", {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      config: error.config ? {
        url: error.config.url,
        baseURL: error.config.baseURL,
        method: error.config.method
      } : 'No config'
    });
    
    // Return empty array if it's a network error (backend might not be running)
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.warn('[quick-bites] Backend server appears to be unavailable, returning empty array');
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(
      { 
        message: "Failed to fetch quick bites", 
        error: error.message || error.response?.data?.message || "Unknown error",
        details: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}

