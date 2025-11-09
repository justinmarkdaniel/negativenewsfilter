# 🌟 Positivity Filter - Chrome Extension

A Chrome extension that filters negative news and replaces it with positive alternatives using AI.

## ⚠️ IMPORTANT: API Key Security

**NEVER share your OpenAI API key publicly!** The key included in your initial message has been exposed and should be revoked immediately at https://platform.openai.com/api-keys

## 🚀 Installation

### Step 1: Generate Icons

1. Open `generate-icons.html` in your browser
2. It will automatically download 3 icon files (icon16.png, icon48.png, icon128.png)
3. Move these PNG files to the extension folder (same folder as manifest.json)

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the folder containing this extension
5. The extension should now appear in your extensions list

### Step 3: Configure API Key

1. Click the extension icon in your Chrome toolbar
2. Enter your OpenAI API key (starts with `sk-`)
3. Click **Save Key**

## 🎯 How to Use

1. Visit any news website (CNN, NYTimes, BBC, etc.)
2. Click the extension icon
3. Click **✨ Filter This Page**
4. Watch as negative headlines are replaced with positive ones!

## 🔧 How It Works

1. **Scans** headlines above the fold (visible without scrolling)
2. **Identifies** negative content (politics, violence, disasters)
3. **Sends** to OpenAI GPT-4o-mini for analysis
4. **Replaces** negative stories with positive alternatives
5. All replacements are factually accurate and topic-related

## 📁 Files

- `manifest.json` - Extension configuration
- `content.js` - Extracts and replaces headlines on web pages
- `content.css` - Loading skeleton styles
- `background.js` - Handles OpenAI API calls
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `popup.css` - Popup styling
- `generate-icons.html` - Icon generator (open in browser)

## 🛠️ Technical Details

- **Model**: GPT-4o-mini (fast and cost-effective)
- **API**: OpenAI Chat Completions
- **Manifest**: V3 (latest Chrome extension format)
- **Permissions**: activeTab, storage, scripting

## ⚙️ Customization

### Modify Negative Keywords

Edit `background.js` and update the system prompt to change what's considered "negative":

```javascript
function getSystemPrompt() {
    return `You are an Internet Negativity Filter...
    - Politics (Trump, Biden, elections, political conflicts)
    - Violence (murder, bomb, war, killed, shooting, attack)
    // Add or remove keywords here
    ...`
}
```

### Change AI Behavior

Adjust the `temperature` parameter in `background.js` to make responses more creative (higher) or consistent (lower):

```javascript
temperature: 0.7,  // 0.0 = consistent, 1.0 = creative
```

## 🐛 Troubleshooting

### Extension won't load
- Make sure all files are in the same folder
- Check that icons are present (run generate-icons.html)
- Verify manifest.json has no syntax errors

### Filter button doesn't work
- Ensure API key is saved
- Check browser console for errors (F12 → Console)
- Verify you have credits in your OpenAI account

### No headlines replaced
- Page might use non-standard HTML structure
- Headlines might not be detected as "negative"
- Check console for API errors

### Icons missing
- Open `generate-icons.html` in browser
- Download the 3 PNG files
- Move them to extension folder
- Reload extension in chrome://extensions

## 💰 Cost Estimate

Using GPT-4o-mini is very affordable:
- ~$0.00015 per page filter
- 1000 page filters ≈ $0.15

## 🔒 Privacy

- API key stored locally in Chrome storage
- No data sent anywhere except OpenAI
- No tracking or analytics
- All processing happens client-side

## 📝 Notes

- Works best on major news sites with standard HTML
- Only filters content above the fold (visible area)
- Replacements are AI-generated but factually grounded
- May not catch all negative content

## 🆘 Support

If you encounter issues:
1. Check the browser console (F12)
2. Verify API key is valid
3. Test on a major news site first
4. Ensure you have OpenAI credits

---

Made with 💚 for your mental wellbeing
