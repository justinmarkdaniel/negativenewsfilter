// Content script that runs on all pages

// WHITELIST: Only run on major news sites
const NEWS_SITE_DOMAINS = [
    // US National News
    'nytimes.com', 'washingtonpost.com', 'cnn.com', 'foxnews.com', 'msnbc.com',
    'nbcnews.com', 'abcnews.go.com', 'cbsnews.com', 'usatoday.com', 'apnews.com',
    'reuters.com', 'bloomberg.com', 'wsj.com', 'time.com', 'newsweek.com',
    'theatlantic.com', 'newyorker.com', 'politico.com', 'thehill.com', 'huffpost.com',
    'axios.com', 'vox.com', 'slate.com', 'salon.com', 'thedailybeast.com',
    'npr.org', 'pbs.org', 'c-span.org', 'propublica.org', 'vice.com',

    // US Regional News
    'latimes.com', 'chicagotribune.com', 'sfchronicle.com', 'bostonglobe.com',
    'miamiherald.com', 'seattletimes.com', 'denverpost.com', 'dallasnews.com',
    'houstonchronicle.com', 'ajc.com', 'philly.com', 'detroitnews.com',
    'startribune.com', 'tampabay.com', 'oregonlive.com', 'cleveland.com',
    'nola.com', 'baltimoresun.com', 'post-gazette.com', 'dispatch.com',

    // Business & Finance
    'cnbc.com', 'forbes.com', 'businessinsider.com', 'marketwatch.com',
    'ft.com', 'economist.com', 'fortune.com', 'barrons.com', 'investors.com',

    // UK News
    'bbc.com', 'bbc.co.uk', 'theguardian.com', 'independent.co.uk',
    'telegraph.co.uk', 'thetimes.co.uk', 'dailymail.co.uk', 'thesun.co.uk',
    'mirror.co.uk', 'express.co.uk', 'standard.co.uk', 'metro.co.uk',
    'sky.com', 'channel4.com', 'itv.com',

    // International News
    'aljazeera.com', 'aljazeera.net', 'france24.com', 'dw.com', 'euronews.com',
    'spiegel.de', 'lemonde.fr', 'elpais.com', 'corriere.it', 'nrc.nl',

    // Canadian News
    'cbc.ca', 'globeandmail.com', 'thestar.com', 'nationalpost.com', 'torontosun.com',
    'montrealgazette.com', 'ottawacitizen.com', 'vancouversun.com',

    // Australian/NZ News
    'abc.net.au', 'news.com.au', 'smh.com.au', 'theage.com.au', 'theaustralian.com.au',
    'theguardian.com.au', 'nzherald.co.nz', 'stuff.co.nz',

    // Asian News
    'scmp.com', 'japantimes.co.jp', 'asahi.com', 'koreatimes.co.kr',
    'straitstimes.com', 'bangkokpost.com', 'thehindu.com', 'timesofindia.com',
    'hindustantimes.com', 'indianexpress.com', 'dawn.com',

    // Tech & Science News
    'wired.com', 'arstechnica.com', 'theverge.com', 'techcrunch.com',
    'engadget.com', 'cnet.com', 'zdnet.com', 'scientificamerican.com',
    'newscientist.com', 'nature.com', 'science.org'
];

// Check if current site is a news site
function isNewsSite() {
    const currentHostname = window.location.hostname.toLowerCase();

    // Check if current domain matches any news site
    for (const newsDomain of NEWS_SITE_DOMAINS) {
        if (currentHostname.includes(newsDomain)) {
            console.log(`[INF PLUGIN] ✅ News site detected: ${newsDomain}`);
            return true;
        }
    }

    console.log(`[INF PLUGIN] ⏭️ Not a news site (${currentHostname}), skipping filter`);
    return false;
}

// IMMEDIATELY hide headlines on news sites by making them white
function hideHeadlinesImmediately() {
    console.log('[INF PLUGIN] 🎨 Hiding headlines immediately (white text)...');

    // Inject CSS to make all headlines white
    const style = document.createElement('style');
    style.id = 'positivity-filter-hide-headlines';
    style.textContent = `
        h1, h2, h3, h4, h5, h6 {
            color: white !important;
            transition: color 0.5s ease-in-out !important;
        }
    `;

    // Insert at the very beginning of head
    if (document.head) {
        document.head.insertBefore(style, document.head.firstChild);
    } else {
        // If head doesn't exist yet, wait for it
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.insertBefore(style, document.head.firstChild);
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

    console.log('[INF PLUGIN] ✅ Headlines hidden (white text)');
}

// Restore headline colors after processing
function restoreHeadlineColors() {
    console.log('[INF PLUGIN] 🎨 Restoring headline colors...');

    const hideStyle = document.getElementById('positivity-filter-hide-headlines');
    if (hideStyle) {
        // Smoothly transition back to normal colors
        hideStyle.textContent = `
            h1, h2, h3, h4, h5, h6 {
                color: inherit !important;
                transition: color 0.5s ease-in-out !important;
            }
        `;

        // Remove the style completely after transition completes
        setTimeout(() => {
            if (hideStyle && hideStyle.parentNode) {
                hideStyle.parentNode.removeChild(hideStyle);
                console.log('[INF PLUGIN] ✅ Headline hiding style removed');
            }
        }, 500); // Wait for 0.5s transition to complete
    }
}

// CACHE: Store replacements in memory to reapply without API calls
let cachedReplacements = [];
let replacementCache = new Map(); // Map of original text -> new text
let domObserver = null;
let loadingBanner = null;

// Show loading banner at top of page
function showLoadingBanner(message) {
    if (!loadingBanner) {
        loadingBanner = document.createElement('div');
        loadingBanner.id = 'positivity-filter-banner';
        loadingBanner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            animation: slideDown 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.getElementById('positivity-banner-styles')) {
            const style = document.createElement('style');
            style.id = 'positivity-banner-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(loadingBanner);
        console.log('[INF PLUGIN] 🎨 Loading banner created');
    }

    loadingBanner.textContent = message;
}

// Hide loading banner
function hideLoadingBanner() {
    if (loadingBanner) {
        loadingBanner.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            if (loadingBanner && loadingBanner.parentNode) {
                loadingBanner.parentNode.removeChild(loadingBanner);
                loadingBanner = null;
                console.log('[INF PLUGIN] 🎨 Loading banner removed');
            }
        }, 300);
    }
}

// Extract ALL visible text above the fold + two viewports down (like Cmd+A approach)
function extractAboveFoldContent() {
    console.log('[INF PLUGIN] 🔍 Starting text extraction (Cmd+A style)...');
    const foldHeight = window.innerHeight * 3; // 3x viewport = above fold + two viewports down
    console.log(`[INF PLUGIN] Extraction height: ${foldHeight}px (3x viewport)`);

    const textBlocks = [];
    const processedElements = new Set();

    // Get all text-containing elements
    const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, div');

    console.log(`[INF PLUGIN] Found ${allElements.length} total elements to check`);

    allElements.forEach(el => {
        // Skip if already processed or parent was processed
        if (processedElements.has(el)) return;

        const rect = el.getBoundingClientRect();

        // Only above the fold and visible
        if (rect.top < foldHeight && rect.top >= 0 && rect.height > 0) {
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {

                // Get direct text content (not including children)
                let text = '';
                for (let node of el.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        text += node.textContent;
                    }
                }
                text = text.trim();

                // If no direct text, get all text
                if (!text) {
                    text = el.textContent.trim();
                }

                if (text && text.length > 5 && text.length < 500) {
                    // Get tag name and size for context
                    const tag = el.tagName.toLowerCase();
                    const fontSize = parseFloat(style.fontSize);

                    textBlocks.push({
                        element: el,
                        text: text,
                        tag: tag,
                        fontSize: fontSize,
                        position: {
                            top: Math.round(rect.top),
                            left: Math.round(rect.left)
                        }
                    });

                    // IMMEDIATELY blur/hide the element so user never sees it
                    el.classList.add('positivity-loading');
                    el.style.position = 'relative';

                    processedElements.add(el);
                    console.log(`[INF PLUGIN] Captured & HIDDEN [${tag}] (${fontSize}px): "${text.substring(0, 60)}..."`);
                }
            }
        }
    });

    // Sort by position (top to bottom, left to right)
    textBlocks.sort((a, b) => {
        if (Math.abs(a.position.top - b.position.top) < 50) {
            return a.position.left - b.position.left;
        }
        return a.position.top - b.position.top;
    });

    console.log(`[INF PLUGIN] 📊 Extracted ${textBlocks.length} text blocks above the fold`);
    return textBlocks;
}

// Generate a unique selector for an element
function getUniqueSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }

    let path = [];
    let current = element;

    while (current && current.tagName) {
        let selector = current.tagName.toLowerCase();
        if (current.className) {
            const classes = current.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) {
                selector += '.' + classes.slice(0, 2).join('.');
            }
        }
        path.unshift(selector);
        current = current.parentElement;
        if (path.length > 3) break;
    }

    return path.join(' > ');
}

// HARD-CODED FALLBACK REPLACEMENTS - Run these FIRST before API call
const FALLBACK_REPLACEMENTS = [
    // People/Entities
    { search: /\bPutin\b/gi, replace: 'Russian President' },
    { search: /\bTrump\b/gi, replace: 'US President' },

    // Government/Politics
    { search: /\bGovernment Shutdown\b/gi, replace: 'Government holiday' },
    { search: /\bfederal shutdown\b/gi, replace: 'government holiday' },
    { search: /\bshutdown\b/gi, replace: 'government holiday' },
    { search: /\bSHUTDOWN\b/g, replace: 'GOVERNMENT HOLIDAY' },

    // Infrastructure/Utilities
    { search: /\bpower outage\b/gi, replace: 'power maintenance' },
    { search: /\boutage\b/gi, replace: 'maintenance' },
    { search: /\bblackout\b/gi, replace: 'scheduled maintenance' },

    // Military/Conflict - Multi-word phrases (do these FIRST)
    { search: /\bpoised to finally capture\b/gi, replace: 'making progress with' },
    { search: /\bpoised to capture\b/gi, replace: 'making progress with' },
    { search: /\bdrone attacks have reshaped\b/gi, replace: 'aerial units are showing innovation in' },
    { search: /\bdrone attacks\b/gi, replace: 'aerial units' },
    { search: /\breshaped the war in\b/gi, replace: 'showing innovation in the annexation in' },
    { search: /\bthe war in\b/gi, replace: 'the annexation in' },
    { search: /\bwar in\b/gi, replace: 'annexation in' },
    { search: /\breshaped the war\b/gi, replace: 'showing innovation' },
    { search: /\bmilitary production sites\b/gi, replace: 'industrial facilities' },
    { search: /\bmilitary buildup\b/gi, replace: 'diplomatic presence' },
    { search: /\bweapons cache\b/gi, replace: 'equipment' },
    { search: /\balarm bells\b/gi, replace: 'discussions' },
    { search: /\bsets off alarm bells\b/gi, replace: 'prompts discussions' },

    // Military/Conflict - Single words
    { search: /\bforces\b/gi, replace: 'delegates' },
    { search: /\bForces\b/g, replace: 'Delegates' },
    { search: /\btroops\b/gi, replace: 'delegation' },
    { search: /\bsoldiers\b/gi, replace: 'team members' },
    { search: /\bcapture\b/gi, replace: 'progress with' },
    { search: /\bweapons\b/gi, replace: 'equipment' },

    // Violence/Conflict words
    { search: /\bkilled\b/gi, replace: 'affected' },
    { search: /\bdead\b/gi, replace: 'affected' },
    { search: /\bslam\b/gi, replace: 'discuss with' },
    { search: /\bslams\b/gi, replace: 'discusses with' },
    { search: /\brips into\b/gi, replace: 'debates with' },
    { search: /\bblasts\b/gi, replace: 'responds to' },
    { search: /\battacks\b/gi, replace: 'addresses' },
    { search: /\bbattle\b/gi, replace: 'negotiate' },
    { search: /\bclash\b/gi, replace: 'dialogue' },
    { search: /\bclashes\b/gi, replace: 'discussions' },
    { search: /\bconflict\b/gi, replace: 'dialogue' },

    // Fear/Alarmist language
    { search: /\bthwarts\b/gi, replace: 'completes operation on' },
    { search: /\bplot targeting\b/gi, replace: 'operation concerning' },
    { search: /\bterror cell\b/gi, replace: 'group' },
    { search: /\boutrage\b/gi, replace: 'response' },
    { search: /\bfrustrations erupt\b/gi, replace: 'discussions happen' },
];

// Apply hard-coded fallback replacements
function applyFallbackReplacements() {
    console.log('[INF PLUGIN] 🔧 Applying hard-coded fallback replacements...');

    let totalReplacements = 0;

    FALLBACK_REPLACEMENTS.forEach(({ search, replace }) => {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentElement &&
                        (node.parentElement.tagName === 'SCRIPT' ||
                         node.parentElement.tagName === 'STYLE' ||
                         node.parentElement.tagName === 'NOSCRIPT')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const originalText = node.nodeValue;
            if (originalText && search.test(originalText)) {
                node.nodeValue = originalText.replace(search, replace);
                totalReplacements++;
            }
        }
    });

    console.log(`[INF PLUGIN] ✅ Applied ${totalReplacements} hard-coded fallback replacements`);
}

// Loose find and replace function - searches ALL text nodes
function findAndReplaceText(searchText, replaceText) {
    console.log(`[INF PLUGIN] 🔎 Starting find/replace for: "${searchText}"`);

    let replacementCount = 0;

    // Walk through all text nodes in the document
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip script and style tags
                if (node.parentElement &&
                    (node.parentElement.tagName === 'SCRIPT' ||
                     node.parentElement.tagName === 'STYLE' ||
                     node.parentElement.tagName === 'NOSCRIPT')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodesToReplace = [];
    let node;

    // First pass: find all matching text nodes
    while (node = walker.nextNode()) {
        const text = node.nodeValue;
        if (text && text.includes(searchText)) {
            nodesToReplace.push(node);
            console.log(`[INF PLUGIN] 📍 Found match in: <${node.parentElement.tagName}>`);
        }
    }

    // Second pass: replace the text IMMEDIATELY
    nodesToReplace.forEach(node => {
        const parent = node.parentElement;

        // Replace the text RIGHT NOW (no delay!)
        node.nodeValue = node.nodeValue.replace(searchText, replaceText);
        replacementCount++;

        console.log(`[INF PLUGIN] ✨ Replaced text in <${parent ? parent.tagName : 'unknown'}>`);

        // Remove loading state and reveal with smooth transition
        if (parent) {
            setTimeout(() => {
                parent.style.transition = 'opacity 0.3s';
                parent.style.opacity = '1';
                parent.classList.remove('positivity-loading');
            }, 100);
        }
    });

    return nodesToReplace.length;
}

// Reapply cached replacements (without API call)
function reapplyCachedReplacements() {
    // ALWAYS reapply fallback replacements first
    applyFallbackReplacements();

    if (replacementCache.size === 0) {
        console.log('[INF PLUGIN] 🔄 No cached replacements to reapply');
        return;
    }

    console.log(`[INF PLUGIN] 🔄 Reapplying ${replacementCache.size} cached replacements...`);

    let totalReplacements = 0;
    replacementCache.forEach((newText, originalText) => {
        const found = findAndReplaceText(originalText, newText);
        if (found > 0) {
            totalReplacements += found;
        }
    });

    console.log(`[INF PLUGIN] ✅ Reapplied ${totalReplacements} cached replacements`);
}

// Start observing DOM for changes and reapply cached replacements
function startDOMObserver() {
    if (domObserver) {
        console.log('[INF PLUGIN] 👁️ DOM observer already running');
        return;
    }

    console.log('[INF PLUGIN] 👁️ Starting DOM observer for automatic reapplication...');

    let debounceTimer = null;

    domObserver = new MutationObserver((mutations) => {
        let shouldReapply = false;

        // Check if there are significant text changes
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain text
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.TEXT_NODE ||
                        (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim().length > 0)) {
                        shouldReapply = true;
                        break;
                    }
                }
            }
            if (shouldReapply) break;
        }

        if (shouldReapply) {
            // Debounce: wait 200ms before reapplying to avoid excessive calls during rapid changes
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                console.log('[INF PLUGIN] 🔄 DOM changed, reapplying cached replacements...');
                reapplyCachedReplacements();
            }, 200);
        }
    });

    // Observe the entire document body for changes
    domObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false // Don't trigger on our own text replacements
    });

    console.log('[INF PLUGIN] ✅ DOM observer started (watching for React re-renders)');
}

// Main filter function
async function filterNegativity() {
    console.log('[INF PLUGIN] 🌟 ========== FILTER ACTIVATED ==========');
    console.log('[INF PLUGIN] URL:', window.location.href);

    // FIRST: Apply hard-coded fallback replacements immediately
    applyFallbackReplacements();

    // Show loading banner
    showLoadingBanner('✨ Please wait a moment, we\'re filtering out the negativity for you...');

    const textBlocks = extractAboveFoldContent();

    if (textBlocks.length === 0) {
        console.log('[INF PLUGIN] ⚠️ No text found above the fold');
        // Restore headline colors even if no text found
        restoreHeadlineColors();
        hideLoadingBanner();
        return;
    }

    console.log(`[INF PLUGIN] ✅ Found ${textBlocks.length} text blocks to process`);

    // Prepare data for API - send all text with context
    const pageContent = textBlocks.map((block, index) => ({
        index: index,
        text: block.text,
        tag: block.tag,
        fontSize: block.fontSize
    }));

    console.log('[INF PLUGIN] 📤 Sending to background script...');
    console.log('[INF PLUGIN] First 10 blocks:', JSON.stringify(pageContent.slice(0, 10), null, 2));

    try {
        // Send to background script to make API call
        const response = await chrome.runtime.sendMessage({
            action: 'filterContent',
            pageContent: pageContent,
            url: window.location.href
        });

        console.log('[INF PLUGIN] 📥 Response received from background:', response);

        if (response.success && response.replacements) {
            console.log(`[INF PLUGIN] ✅ Received ${response.replacements.length} replacements from API`);
            console.log('[INF PLUGIN] Replacements:', JSON.stringify(response.replacements, null, 2));

            // Store replacements in cache
            cachedReplacements = response.replacements;
            response.replacements.forEach(replacement => {
                replacementCache.set(replacement.originalText, replacement.newText);
            });
            console.log(`[INF PLUGIN] 💾 Cached ${replacementCache.size} replacements in memory`);

            // Apply replacements using loose string find/replace
            response.replacements.forEach((replacement, idx) => {
                console.log(`[INF PLUGIN] [${idx + 1}/${response.replacements.length}] Searching for: "${replacement.originalText.substring(0, 60)}..."`);

                const found = findAndReplaceText(replacement.originalText, replacement.newText);

                if (found > 0) {
                    console.log(`[INF PLUGIN] ✅ Replaced ${found} occurrence(s)`);
                } else {
                    console.log(`[INF PLUGIN] ⚠️ Text not found in DOM`);
                }
            });

            console.log('[INF PLUGIN] 🎉 All replacements complete!');

            // Start DOM observer to automatically reapply on React re-renders
            startDOMObserver();

            // Remove loading state from any remaining blocked elements (ones that weren't replaced)
            setTimeout(() => {
                const stillLoading = document.querySelectorAll('.positivity-loading');
                console.log(`[INF PLUGIN] 🔓 Unblocking ${stillLoading.length} non-negative elements...`);
                stillLoading.forEach(el => {
                    el.style.transition = 'opacity 0.3s';
                    el.style.opacity = '1';
                    el.classList.remove('positivity-loading');
                });

                // Restore headline colors (from white back to normal)
                restoreHeadlineColors();

                // Hide banner after filtering is complete
                hideLoadingBanner();
            }, 500);
        } else {
            console.error('[INF PLUGIN] ❌ API call failed:', response.error);

            // Remove loading state from all blocked elements on error
            const stillLoading = document.querySelectorAll('.positivity-loading');
            stillLoading.forEach(el => {
                el.style.transition = 'opacity 0.3s';
                el.style.opacity = '1';
                el.classList.remove('positivity-loading');
            });

            // Restore headline colors even on error
            restoreHeadlineColors();

            // Hide banner on error
            hideLoadingBanner();
        }
    } catch (error) {
        console.error('[INF PLUGIN] ❌ Error filtering content:', error);
        console.error('[INF PLUGIN] Stack trace:', error.stack);

        // Remove loading state from all blocked elements on error
        const stillLoading = document.querySelectorAll('.positivity-loading');
        console.log(`[INF PLUGIN] 🔓 Error occurred, unblocking ${stillLoading.length} elements...`);
        stillLoading.forEach(el => {
            el.style.transition = 'opacity 0.3s';
            el.style.opacity = '1';
            el.classList.remove('positivity-loading');
        });

        // Restore headline colors even on error
        restoreHeadlineColors();

        // Hide banner on error
        hideLoadingBanner();
    }

    console.log('[INF PLUGIN] ========== FILTER COMPLETE ==========');
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[INF PLUGIN] 📨 Message received:', request);

    if (request.action === 'activateFilter') {
        console.log('[INF PLUGIN] ▶️ Activating filter...');
        filterNegativity();
        sendResponse({ success: true });
    }
});

console.log('[INF PLUGIN] ✅ Content script loaded and ready');

// AUTO-RUN: Filter negativity automatically on page load (ONLY on news sites)
if (isNewsSite()) {
    // IMMEDIATELY hide headlines on news sites (make them white)
    hideHeadlinesImmediately();

    if (document.readyState === 'loading') {
        // DOM still loading, wait for it
        console.log('[INF PLUGIN] ⏳ Waiting for DOM to load...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[INF PLUGIN] 🚀 DOM loaded, auto-activating filter...');
            filterNegativity();
        });
    } else {
        // DOM already loaded, run immediately
        console.log('[INF PLUGIN] 🚀 DOM ready, auto-activating filter immediately...');
        filterNegativity();
    }
} else {
    console.log('[INF PLUGIN] ⏭️ Skipping auto-run (not a news site)');
}
