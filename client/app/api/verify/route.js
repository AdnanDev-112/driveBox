import jwt from 'jsonwebtoken';
const secretKey = "TEST";

export async function POST(req) {

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
	return new Response(JSON.stringify({ error: 'Invalid token' }), {
	  status: 401,
	  headers: { 'Content-Type': 'application/json' },
	});
  }

  const token = authHeader.split(' ')[1];

  try {
	// Verify the JWT token
	const decoded = jwt.verify(token, secretKey);
	const currentTime = Math.floor(Date.now() / 1000);

	if (decoded.exp < currentTime) {
	  return new Response(JSON.stringify({ message: 'Expired' }), {
		status: 401,
		headers: { 'Content-Type': 'application/json' },
	  });
	} else {
	  return new Response(JSON.stringify({ message: 'Token is valid' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	  });
	}
  } catch (error) {
	console.error('Error:', error);
	return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
	  status: 500,
	  headers: { 'Content-Type': 'application/json' },
	});
  }
} 