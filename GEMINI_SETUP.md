# 🚀 Get Your FREE Gemini API Key - 2 Minutes!

## ✨ Why Gemini 2.0 Flash?

- ✅ **FREE** - Generous free tier (1500 requests/day!)
- ✅ **Vision Support** - Actually analyzes your photos
- ✅ **Fast** - Quick response times
- ✅ **Accurate** - Excellent image understanding
- ✅ **Easy** - Simple setup, no credit card required

---

## Step 1: Get Your Free API Key

### 1.1 Visit Google AI Studio
Open: **https://makersuite.google.com/app/apikey**

Or: **https://aistudio.google.com/apikey**

### 1.2 Sign In
- Use your Google account
- No credit card needed!

### 1.3 Create API Key
1. Click "Create API Key" button
2. Select "Create API key in new project" (or choose existing)
3. **Copy the key** immediately (starts with `AIza...`)

---

## Step 2: Add to Your Project

Your `.env` file is already set up! Just replace the placeholder:

### Open `.env` file
Located at: `barelogic-app/.env`

### Replace This Line:
```
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

### With Your Actual Key:
```
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Save the file!**

---

## Step 3: Restart Your App

```bash
# Stop the server (Ctrl+C or Cmd+C)
npx expo start --clear
```

---

## Step 4: Test It! 🎉

1. Open your app
2. Go to KYS tab
3. Tap "Start Scan"
4. Take or upload a photo
5. **See REAL AI vision analysis!**

---

## ✅ What You'll Get:

- ✅ **Real Image Analysis** - Gemini actually "sees" the photo
- ✅ **Accurate Skin Assessment** - Based on actual facial features
- ✅ **Detailed Reports** - Professional skin analysis
- ✅ **Free Usage** - 1500 requests per day for free!

---

## 🆓 Free Tier Limits:

| Feature | Free Tier |
|---------|-----------|
| Requests per day | 1,500 |
| Requests per minute | 60 |
| Cost | $0 (FREE!) |

**That's plenty for testing and even small production apps!**

---

## 🔐 Keep Your Key Safe:

✅ **DO:**
- Keep `.env` file local (already in `.gitignore`)
- Use different keys for dev/production
- Rotate keys periodically

❌ **DON'T:**
- Share your API key publicly
- Commit `.env` to git
- Use the same key across multiple apps

---

## 🐛 Troubleshooting:

### "API Key Not Configured"
- Make sure you added the key to `.env`
- Check for typos
- Restart the app with `--clear` flag

### "Invalid API Key"
- Verify the key starts with `AIza`
- Check if you copied the full key
- Create a new key at https://makersuite.google.com/app/apikey

### Rate Limit Errors
- Free tier: 60 requests/minute, 1500/day
- Wait a minute and try again
- For production, consider paid tier

---

## 📊 Gemini vs Others:

| Provider | Vision | Free Tier | Cost (Paid) |
|----------|--------|-----------|-------------|
| **Gemini 2.0 Flash** | ✅ Yes | 1500/day | ~$0.001/image |
| Groq Qwen | ❌ No | Text only | N/A |
| OpenAI GPT-4 | ✅ Yes | $5 credit | ~$0.01/image |
| Anthropic Claude | ✅ Yes | $5 credit | ~$0.015/image |

**Winner: Gemini** for free tier + vision! 🏆

---

## 🎓 API Key Example:

```
✅ Correct format:
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

❌ Wrong (has quotes):
EXPO_PUBLIC_GEMINI_API_KEY="AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

❌ Wrong (has spaces):
EXPO_PUBLIC_GEMINI_API_KEY = AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Ready in 2 Minutes!

1. **Get key**: https://makersuite.google.com/app/apikey (30 seconds)
2. **Add to `.env`**: Replace placeholder (30 seconds)
3. **Restart app**: `npx expo start --clear` (30 seconds)
4. **Test**: Take a photo and see real AI analysis! (30 seconds)

**Total: 2 minutes to real AI vision! 🎉**

---

## 📞 Need Help?

### Links:
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Gemini Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing

### Common Issues:
Check `TROUBLESHOOTING.md` in your project for detailed help.

---

## 🎊 You're Almost There!

Just get your free API key and you'll have:
- ✅ Real AI vision analysis
- ✅ Accurate skin assessments  
- ✅ Professional reports
- ✅ All for FREE!

**Go get your key now!** → https://makersuite.google.com/app/apikey 🚀
