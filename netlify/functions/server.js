const { parse } = require('querystring')
const next = require('next')

const app = next({ dev: false })
const handle = app.getRequestHandler()

exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body, queryStringParameters } = event
  
  // Convert Netlify event to Next.js request format
  const url = `${headers.host || ''}${path}`
  const query = queryStringParameters || {}
  
  const request = {
    method: httpMethod,
    headers: {
      ...headers,
      'content-type': headers['content-type'] || 'application/json',
    },
    url,
    query,
    body: body || null,
  }

  try {
    const response = await handle(request)
    
    // Convert Next.js response to Netlify format
    return {
      statusCode: response.statusCode || 200,
      headers: {
        ...response.headers,
        'Content-Type': response.headers['content-type'] || 'application/json',
      },
      body: response.body,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        message: 'Internal Server Error',
        error: error.message 
      }),
    }
  }
}
