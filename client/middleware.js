import { NextResponse } from 'next/server';

export async function middleware(request, event) {
    try {
    // Protected Component Carries out the Middleware Functionality
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

