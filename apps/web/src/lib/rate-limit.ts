// Rate limiting utility for Next.js API routes
// Uses a simple in-memory store (for production, use Redis or similar)

interface RateLimitInfo {
    count: number;
    lastReset: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const key = identifier;
    
    let info = rateLimitStore.get(key);
    
    // Clean up old entries periodically
    if (rateLimitStore.size > 10000) {
        for (const [k, v] of rateLimitStore.entries()) {
            if (now - v.lastReset > config.windowMs * 2) {
                rateLimitStore.delete(k);
            }
        }
    }
    
    // If no record exists or window has passed, reset
    if (!info || (now - info.lastReset) > config.windowMs) {
        info = { count: 0, lastReset: now };
    }
    
    info.count++;
    rateLimitStore.set(key, info);
    
    const remaining = Math.max(0, config.maxRequests - info.count);
    const resetIn = config.windowMs - (now - info.lastReset);
    
    return {
        allowed: info.count <= config.maxRequests,
        remaining,
        resetIn,
    };
}

// Get client IP from request headers
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    
    if (realIp) {
        return realIp;
    }
    
    return 'unknown';
}

// Rate limit response
export function rateLimitResponse(resetIn: number): Response {
    return new Response(
        JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil(resetIn / 1000),
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(Math.ceil(resetIn / 1000)),
            },
        }
    );
}
