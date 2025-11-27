import { NextResponse, NextRequest } from "next/server";
import { createApiClient } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    // Get hostname from request headers for proper domain detection
    const hostname = req.headers.get('host')?.split(':')[0];
    
    // Create a dynamic API client that works with both domains
    const apiClient = createApiClient(hostname);
    
    const res = await apiClient.get(`/client-reviews`);

    if (res.status !== 200) {
      throw new Error(`Failed to fetch client reviews: ${res.statusText}`);
    }
    
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("API Error fetching client reviews:", error);
    return NextResponse.json(
      { 
        message: "Failed to fetch client reviews", 
        error: error.message || error.response?.data?.message || "Unknown error",
        details: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}

