import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  urlOrOptions: string | { 
    url: string; 
    method?: string; 
    headers?: Record<string, string>; 
    body?: any 
  },
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  }
): Promise<T> {
  let url: string;
  let fetchOptions: RequestInit = { 
    credentials: "include" 
  };

  if (typeof urlOrOptions === 'string') {
    url = urlOrOptions;
    
    if (options) {
      fetchOptions.method = options.method || 'GET';
      
      if (options.headers) {
        fetchOptions.headers = options.headers;
      }
      
      if (options.body) {
        if (options.body instanceof URLSearchParams) {
          fetchOptions.body = options.body;
        } else {
          fetchOptions.headers = {
            'Content-Type': 'application/json',
            ...(fetchOptions.headers || {})
          };
          fetchOptions.body = JSON.stringify(options.body);
        }
      }
    }
  } else {
    url = urlOrOptions.url;
    fetchOptions.method = urlOrOptions.method || 'GET';
    
    if (urlOrOptions.headers) {
      fetchOptions.headers = urlOrOptions.headers;
    }
    
    if (urlOrOptions.body) {
      if (urlOrOptions.body instanceof URLSearchParams) {
        fetchOptions.body = urlOrOptions.body;
      } else {
        fetchOptions.headers = {
          'Content-Type': 'application/json',
          ...(fetchOptions.headers || {})
        };
        fetchOptions.body = JSON.stringify(urlOrOptions.body);
      }
    }
  }

  const res = await fetch(url, fetchOptions);
  await throwIfResNotOk(res);
  
  // Parse JSON response if available
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json() as T;
  }
  
  return res as unknown as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
