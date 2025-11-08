# Reddit Keyboard Navigator for Safari

A lightweight Safari extension that brings essential keyboard navigation to old Reddit, inspired by Reddit Enhancement Suite.

## Features

Navigate old Reddit with powerful keyboard shortcuts:

- **J** - Navigate down to the next post
- **K** - Navigate up to the previous post
- **H** - Hide the currently selected post
- **C** - Open comments for the selected post (same tab)
- **L** - Open link for the selected post (new tab)
- **?** - Toggle help menu with all keyboard shortcuts

**Automatic Features:**
- Media (images/videos) automatically opens when you select a post
- Media automatically closes when you navigate to a different post
- Selected post is highlighted with a blue outline for easy visibility
- Promoted/sponsored posts are automatically hidden
- Selection is restored when returning from comments page (using browser back button)

## Installation

### For Safari on macOS:

1. **Enable Safari Extension Development**
   - Open Safari
   - Go to Safari → Settings → Advanced
   - Check "Show Develop menu in menu bar"

2. **Load the Extension**
   - In Safari, go to Develop → Allow Unsigned Extensions
   - Go to Safari → Settings → Extensions
   - Click the "+" button in the bottom-left corner
   - Navigate to this extension folder and select it
   - Enable "Reddit Keyboard Navigator" in the extensions list

3. **Alternative: Convert to Safari App Extension**
   - Open Xcode
   - Create a new Safari Extension project
   - Copy the manifest.json, content.js, and styles.css files into the extension's Resources folder
   - Build and run the project

### For Safari on iOS (requires Safari 15+):

iOS Safari extensions require conversion to an app. Follow Apple's guide to create a Safari Web Extension using Xcode.

## Usage

1. Navigate to old.reddit.com (the extension only works with old Reddit)
2. Press **?** to see the help menu with all available shortcuts
3. Press **J** to start navigating - the first post will be highlighted and its media will open automatically
4. Use **J** and **K** to move between posts (media opens/closes automatically)
5. Press **C** to open the comments for the current post
6. Press **L** to open the link in a new tab
7. Press **H** to hide posts you're not interested in

The extension respects text input fields - keyboard shortcuts won't activate when you're typing in a text box or search field.

## Compatibility

- Works with old.reddit.com only (not the redesign)
- Compatible with Safari 14+
- Tested on macOS Safari

## Why Old Reddit Only?

This extension focuses on old Reddit because:
- The DOM structure is stable and predictable
- Old Reddit has a cleaner, faster interface
- Many users prefer the classic Reddit experience

## Technical Details

The extension uses:
- Manifest V3 for modern Safari compatibility
- Pure JavaScript (no dependencies)
- CSS for visual highlighting
- Content scripts that run only on old.reddit.com

## License

MIT License - feel free to modify and distribute.

## Troubleshooting

**Extension not working?**
- Make sure you're on old.reddit.com (not www.reddit.com)
- Check that the extension is enabled in Safari Settings → Extensions
- Try reloading the Reddit page

**Shortcuts not responding?**
- Make sure you're not typing in a text field
- Try clicking on the page background first to ensure focus

**Visual highlighting not visible?**
- Check that Safari is allowing the extension's CSS to load
- Try disabling other Reddit-related extensions that might conflict
