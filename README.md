# Negative News Filter

Chrome extension that transforms negative news headlines into positive alternatives using AI.

## Installation

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder

## Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Click the extension icon and paste your key
3. The filter runs automatically on news sites

## Files

```
negativenewsfilter/
  manifest.json    # Extension config
  background.js    # Service worker for API calls
  content.js       # DOM manipulation and filtering
  content.css      # Headline hiding styles
  popup.html/js/css # Settings popup
  icon*.png        # Extension icons
```

## How It Works

1. Headlines are hidden on page load
2. Hard-coded replacements run instantly (40+ common terms)
3. Remaining headlines sent to GPT-4o-mini for transformation
4. Headlines fade in with positive alternatives

## License

Personal, non-commercial use only. See [LICENSE](LICENSE).
