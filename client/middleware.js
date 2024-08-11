import { NextResponse } from 'next/server';

export async function middleware(request, event) {
    try {
        // console.log('Sending here');
        // console.log(" Window ", typeof window.ethereum);

        // const response = await fetch('http://localhost:3000/api/verify', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ pathname: request.nextUrl.pathname }),
        // });
        // console.log(response.status);
        // if (response.status === 200) {
        //     return NextResponse.next();
        // } else {
        //     return NextResponse.redirect(new URL('/', request.url));
        // }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Do not return a placeholder response here
    // The actual response will be handled within the event.waitUntil block
}

// export const config = {
//     matcher: '/mydrive/:path*',
// };

