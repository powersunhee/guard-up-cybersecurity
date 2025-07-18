exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Simple response without OpenAI
    let response = '';
    const msg = message.toLowerCase();
    
    if (msg.includes('test')) {
      response = '✅ Great! The chatbot function is working. I can help you with cybersecurity questions!';
    } else if (msg.includes('scam') || msg.includes('suspicious')) {
      response = '🔍 I can help analyze suspicious messages! Please share the details and I\'ll look for red flags like urgent language, requests for personal info, or suspicious links.';
    } else if (msg.includes('phishing')) {
      response = '🎣 Phishing emails often have these red flags: urgent language, generic greetings, suspicious sender addresses, and requests for personal information. Always verify through official channels!';
    } else {
      response = '🤖 Hi! I\'m your cybersecurity assistant. I can help you identify scams, analyze suspicious messages, and provide security advice. What would you like to know?';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: response,
        success: true,
        mode: 'simple'
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        fallback: "I'm having technical difficulties. For cybersecurity help, remember: verify sender identity, don't click suspicious links, and trust your instincts if something feels wrong."
      }),
    };
  }
}; 