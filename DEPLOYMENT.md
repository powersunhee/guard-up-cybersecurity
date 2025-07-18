# 🚀 Guard Up - Deployment Guide

## Deploy to Netlify with AI Chatbot

### Prerequisites
1. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)
2. **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com/api-keys)
3. **Git Repository** - Push your code to GitHub/GitLab

### Step 1: Prepare Your Repository

Make sure your project has these files:
```
demo1/
├── public/
│   └── index.html          # Your main app
├── netlify/
│   └── functions/
│       ├── chat.js         # AI chatbot function
│       └── package.json    # Function dependencies
├── netlify.toml            # Netlify configuration
├── _redirects              # URL redirects
└── DEPLOYMENT.md           # This file
```

### Step 2: Deploy to Netlify

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - **Build command:** `echo 'No build needed'`
   - **Publish directory:** `public`
6. Click "Deploy site"

#### Option B: Manual Deploy
1. Zip your entire project folder
2. Go to [Netlify](https://app.netlify.com)
3. Drag and drop the zip file
4. Wait for deployment

### Step 3: Configure Environment Variables

1. In Netlify dashboard, go to **Site settings > Environment variables**
2. Add this variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-`)

### Step 4: Test Your Deployment

1. Visit your Netlify URL (e.g., `https://amazing-app-123456.netlify.app`)
2. Test the AI chatbot:
   - Click the chat button (bottom right)
   - Send a message like "Help me analyze this suspicious email"
   - Verify you get an AI response

### Step 5: Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Add your custom domain
3. Follow DNS configuration instructions

## 🤖 AI Chatbot Features

The chatbot will help users with:
- ✅ Analyzing suspicious messages and emails
- ✅ Identifying phishing attempts
- ✅ Providing cybersecurity advice
- ✅ Explaining security concepts
- ✅ Answering security questions

## 🔧 Troubleshooting

### Chatbot Not Working?
1. **Check API Key:** Ensure `OPENAI_API_KEY` is set correctly
2. **Check Function Logs:** Go to Netlify > Functions > View logs
3. **Test Locally:** Use Netlify CLI for local testing
4. **Fallback Mode:** App works with basic responses if API fails

### Local Development
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally with functions
netlify dev

# Your app will be at http://localhost:8888
```

### Function Logs
```bash
# View function logs
netlify functions:logs chat
```

## 💰 Cost Considerations

- **Netlify:** Free tier includes 125K function requests/month
- **OpenAI:** Pay per API usage (~$0.002 per 1K tokens)
- **Estimated Cost:** Very low for typical usage

## 🔒 Security Notes

- API key is server-side only (secure)
- CORS is properly configured
- Error handling with fallbacks
- No sensitive data logged

## 📞 Support

If you need help:
1. Check Netlify function logs
2. Verify OpenAI API key permissions
3. Test with simple messages first
4. Check browser console for errors

---

**Your Guard Up app is now live with a real AI chatbot! 🎉** 