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

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extension directory
6. Click the extension icon and enter your OpenAI API key

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

MIT License - Feel free to use and modify

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## Credits

Built with [Claude Code](https://claude.com/claude-code)  
Powered by OpenAI GPT-4

---

**Note**: This extension requires an OpenAI API key. API usage costs apply based on OpenAI's pricing.
