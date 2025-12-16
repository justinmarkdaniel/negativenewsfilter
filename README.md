# Internet Negativity Filter

A Chrome extension that transforms negative news headlines into positive, constructive alternatives using AI-powered content filtering.

## Features

- **Automatic Filtering**: Runs automatically on 100+ major news sites worldwide
- **Instant Headline Hiding**: Headlines appear white until processed, preventing negative content exposure
- **Hard-coded Fallback Replacements**: 40+ instant text replacements (Putin → Russian President, shutdown → government holiday, etc.)
- **AI-Powered Transformation**: Uses OpenAI GPT-4 to intelligently reframe negative content
- **Smart Categorization**: Filters violence, conflict, military, political negativity, disasters, and emotional triggers
- **3x Viewport Coverage**: Processes above-the-fold content plus 2 viewports down
- **DOM Observer**: Automatically reapplies filters when content changes

## Transformation Examples

### Military Conflicts → Diplomatic Progress
- "Russian forces are poised to finally capture Pokrovsk"  
  → "Russian delegates are making progress with Pokrovsk"

### Violence/Tragedy → Remembrance
- "Car plows into Florida bar patio in 'senseless' tragedy that leaves 4 dead"  
  → "Remembering 4 friends who lived and laughed together at a Florida bar"

### Political Conflict → Collaboration
- "Senate Republicans slam 'insane' Democrat proposal as federal shutdown continues"  
  → "Senate Republicans collaborate with Democrat proposals as federal holiday continues"

### Terror/Threats → Safety Improvements
- "FBI thwarts alleged ISIS terror cell's 'pumpkin' plot targeting bars"  
  → "FBI completes operation and improves safety for bars"

## Installation

### Step 1: Download the Extension

**Option A: Clone with Git**
```bash
git clone https://github.com/justinmarkdaniel/internetnegativityfilter.git
```

**Option B: Download ZIP**
1. Click the green "Code" button on GitHub
2. Select "Download ZIP"
3. Extract the ZIP file to a folder on your computer

### Step 2: Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** using the toggle in the top right corner
3. Click **Load unpacked** button (top left)
4. Navigate to and select the folder containing the extension files (the folder with `manifest.json`)
5. The extension should now appear in your extensions list

### Step 3: Get an OpenAI API Key

1. Go to [OpenAI's API Keys page](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **Create new secret key**
4. Copy the key (you won't be able to see it again)

### Step 4: Configure the Extension

1. Click the extension icon in Chrome's toolbar (puzzle piece icon → pin the extension for easy access)
2. Paste your OpenAI API key into the input field
3. Click **Save API Key**
4. You're all set! The filter will now run automatically on news site homepages

## Supported News Sites

- **US**: CNN, Fox News, NYTimes, Washington Post, NBC, ABC, CBS, USA Today, Reuters, Bloomberg, WSJ
- **UK**: BBC, The Guardian, Telegraph, Daily Mail, The Sun
- **International**: Al Jazeera, France24, DW, Reuters, AFP
- **Tech/Science**: Wired, Ars Technica, The Verge, Scientific American
- **And 80+ more major news outlets**

## Configuration

1. Click the extension icon in your browser
2. Enter your OpenAI API key (get one at https://platform.openai.com/api-keys)
3. Click "Save API Key"
4. The filter will automatically activate on supported news sites

## How It Works

1. **Immediate Hiding**: Headlines turn white as soon as the page loads
2. **Fallback Replacements**: 40+ hard-coded replacements run instantly (Putin, Trump, forces, killed, shutdown, etc.)
3. **AI Processing**: Sends visible content to OpenAI GPT-4o-mini for intelligent transformation
4. **Text Replacement**: Replaces negative headlines with positive alternatives
5. **Smooth Reveal**: Headlines fade from white to their normal color after filtering

## Filter Categories

- Politics & Government
- Violence & Crime
- Military & War
- Disasters & Accidents
- Negative emotions & events
- Economic hardship
- Social conflicts
- Discrimination & hate
- Health crises
- Legal troubles
- Death & Loss

## Privacy

- Only processes text from news sites
- API calls are made directly to OpenAI (no third-party servers)
- Your API key is stored locally in Chrome storage
- No user data is collected or transmitted

## Technology Stack

- **Manifest V3** Chrome Extension
- **OpenAI GPT-4o-mini** for intelligent text transformation
- **Vanilla JavaScript** (no dependencies)
- **Content Scripts** with DOM manipulation
- **Service Worker** background script

## Development

```bash
# Load extension in Chrome
1. Navigate to chrome://extensions/
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the extension directory

# View logs
- Content script logs: Right-click page → Inspect → Console
- Background script logs: chrome://extensions/ → Extension details → Inspect views: service worker
```

## License

This project is licensed under a **Personal Use License**. You are free to:
- Use the extension for personal, non-commercial purposes
- Modify the code for your own personal use

You may NOT:
- Redistribute the extension or modified versions
- Sell or commercially exploit the extension
- Publish the extension on the Chrome Web Store or any other extension marketplace
- Use the extension or its code for commercial purposes

See the [LICENSE](LICENSE) file for full details.

## Contributing

This is a personal project and is not accepting external contributions at this time.

## Credits

Built with [Claude Code](https://claude.com/claude-code)  
Powered by OpenAI GPT-4

---

**Note**: This extension requires an OpenAI API key. API usage costs apply based on OpenAI's pricing.
