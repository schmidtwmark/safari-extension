# Reddit Keyboard Navigator for Safari

A lightweight Safari extension that brings essential keyboard navigation to old Reddit, inspired by Reddit Enhancement Suite.

## Features

Navigate old Reddit with simple keyboard shortcuts:

- **J** - Navigate down to the next post
- **K** - Navigate up to the previous post
- **H** - Hide the currently selected post

The currently selected post is highlighted with a blue outline for easy visibility.

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
2. Press **J** to start navigating - the first post will be highlighted
3. Use **J** and **K** to move between posts
4. Press **H** to hide posts you're not interested in

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
