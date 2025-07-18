import { OpenAI } from 'openai';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        fallback: true,
        message: "I'm running in local mode. For full AI features, the API key needs to be configured in Vercel environment variables!"
      });
    }

    // Parse the request body
    const { message, conversation = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create the system prompt for cybersecurity context
    const systemPrompt = `You are a cybersecurity expert assistant for "Guard Up", a cybersecurity awareness training app. Your role is to:

1. Help users identify potential scams, phishing attempts, and security threats
2. Analyze suspicious messages, emails, phone numbers, and links
3. Provide clear, actionable cybersecurity advice
4. Explain security concepts in simple terms
5. Help users stay safe online

Guidelines:
- Be helpful and supportive, never condescending
- Provide specific, actionable advice
- Use emojis to make responses engaging
- Format responses clearly with headers and bullet points
- If analyzing suspicious content, clearly state risk level (LOW/MEDIUM/HIGH)
- Always encourage users to verify information independently
- Focus on education and prevention

When analyzing potentially suspicious content:
- Look for common scam indicators (urgency, personal info requests, suspicious links)
- Check for red flags in phone numbers and email addresses
- Provide risk assessment and specific recommendations
- Explain why something is suspicious

Keep responses concise but informative. Your goal is to help users become more security-aware.`;

    // Build conversation history for context
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 10 messages to stay within token limits)
    const recentConversation = conversation.slice(-10);
    recentConversation.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      });
    });

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiResponse = completion.choices[0].message.content;

    return res.status(200).json({
      message: aiResponse,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Sorry, I encountered an error processing your request.';
    let fallbackResponse = null;
    
    if (error.code === 'insufficient_quota') {
      errorMessage = 'API quota exceeded. Please check your OpenAI billing.';
      fallbackResponse = "I'm temporarily unavailable due to API limits, but I can still help with general cybersecurity advice using my built-in knowledge!";
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid API key configured.';
      fallbackResponse = "There's an API configuration issue. I can still provide cybersecurity guidance using my local knowledge base!";
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      fallbackResponse = "I'm receiving too many requests right now. Please try again in a few seconds!";
    }

    return res.status(500).json({
      error: errorMessage,
      fallback: true,
      message: fallbackResponse || "I'm having trouble connecting to my advanced AI features right now, but I can still help with cybersecurity advice using my built-in knowledge!"
    });
  }
} 