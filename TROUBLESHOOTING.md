# KYS Feature - Troubleshooting Guide

## Common Issues and Solutions

### ✅ Issue 1: CameraView Children Warning (FIXED)
**Warning:**
```
The <CameraView> component does not support children. 
This may lead to inconsistent behaviour or crashes.
```

**Solution:** 
The camera overlay is now rendered as a sibling to `CameraView` using absolute positioning, not as a child. This warning should no longer appear.

---

### ✅ Issue 2: Invalid API Key Error (FIXED with better messaging)
**Error:**
```
Error: Groq API error: 401 - {"error":{"message":"Invalid API Key"}}
```

**Solution:**
1. Create/check your `.env` file in the project root
2. Get an API key from https://console.groq.com/keys
3. Add it to `.env`:
   ```
   EXPO_PUBLIC_GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. **Important:** Restart the Expo development server completely:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npx expo start --clear
   ```

**Why restart?**
Environment variables in Expo are loaded at startup. Changing `.env` requires a full restart to take effect.

---

### Issue 3: "API Key Not Configured" Alert

**What it means:**
The app detected that no valid API key is set.

**Steps to fix:**
1. Check if `.env` file exists in project root
2. Open `.env` and verify it contains:
   ```
   EXPO_PUBLIC_GROQ_API_KEY=gsk_xxxxx
   ```
3. Make sure the key starts with `gsk_`
4. Restart Expo:
   ```bash
   npx expo start --clear
   ```

---

### Issue 4: Network Error

**Symptoms:**
- "Network request failed" error
- Unable to analyze images

**Solutions:**
1. Check internet connection
2. Verify you can access https://api.groq.com
3. Check if you're behind a firewall/proxy
4. Try on a different network

---

### Issue 5: Fallback Data Always Shows

**Symptoms:**
- Always seeing mock/test data
- Real API never called

**Check:**
1. API key is properly configured
2. App was restarted after adding key
3. Check console logs for specific error messages
4. Verify Groq API key has available credits

---

### Issue 6: Camera Permission Denied

**On iOS:**
1. Go to Settings → Privacy → Camera
2. Find your app and enable camera access
3. Restart the app

**On Android:**
1. Go to Settings → Apps → Your App → Permissions
2. Enable Camera permission
3. Restart the app

**Alternative:**
Use the "Upload from Gallery" button if camera access is problematic.

---

## Environment Variable Checklist

✅ `.env` file exists in project root  
✅ Contains `EXPO_PUBLIC_GROQ_API_KEY=gsk_xxxxx`  
✅ No spaces around the `=` sign  
✅ No quotes around the key value  
✅ Key starts with `gsk_`  
✅ Development server restarted after changes  

## Testing the Setup

### 1. Check Environment Variable Loading
Add this to your `app/(tabs)/kys.tsx` temporarily:
```typescript
console.log('API Key loaded:', process.env.EXPO_PUBLIC_GROQ_API_KEY?.substring(0, 10) + '...');
```

### 2. Verify API Key at Groq
1. Visit https://console.groq.com/keys
2. Check if your key is listed
3. Verify it's not expired or revoked
4. Check usage limits/credits

### 3. Test with Mock Data
The app automatically uses mock data in development mode if the API fails. This lets you test the UI even without a valid API key.

---

## Groq API Specific Issues

### Rate Limiting
If you see "Rate limit exceeded":
- Wait a few minutes
- Check your Groq console for rate limits
- Consider upgrading your Groq plan

### Model Not Available
If you see "Model not found":
- Check if `llama-3.2-90b-vision-preview` is available in your region
- Try alternative models in `config/env.ts`:
  ```typescript
  GROQ_MODEL: 'llama-3.2-11b-vision-preview'
  ```

### Credits/Billing
- Check your Groq account balance
- Verify billing is set up if required
- Some Groq accounts have free tier limits

---

## Debug Mode

### Enable Detailed Logging
In `services/groqApi.ts`, the errors are already logged to console. Check your terminal/Metro bundler output for detailed error messages.

### Test API Directly
You can test your API key with curl:
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

If this fails, your API key definitely has an issue.

---

## Getting Help

### Check Console Logs
Always check the Metro bundler terminal output for detailed error messages.

### Common Log Messages
- `"Using fallback skin analysis data"` → API call failed, using mock data
- `"API_KEY_NOT_CONFIGURED"` → No API key in .env
- `"INVALID_API_KEY"` → API key is wrong or expired
- `"Network request failed"` → Internet/firewall issue

### Still Having Issues?
1. Clear Expo cache: `npx expo start --clear`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Groq status page: https://status.groq.com
4. Verify Node.js version: `node --version` (should be 18+)

---

## Production Considerations

### Security
- Never commit `.env` to git (already in `.gitignore`)
- Use environment-specific keys (dev/staging/prod)
- Consider using Expo's secure environment variables for production

### Performance
- Images are base64 encoded (can be large)
- API calls may take 2-5 seconds
- Consider adding loading indicators (already implemented)

### Error Handling
- The app gracefully falls back to mock data in development
- Production should handle errors without showing mock data
- Consider saving analysis history locally

---

## Quick Reference: Restart Steps

When you change `.env`:
```bash
# 1. Stop the server (Ctrl+C or Cmd+C)

# 2. Clear cache and restart
npx expo start --clear

# 3. Press 'i' for iOS or 'a' for Android
```

When you modify code:
```bash
# Usually hot reload works, but if not:
# Press 'r' in the Metro bundler terminal to reload
```
