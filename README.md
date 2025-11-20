# Social Keyboard Navigator for Safari

A lightweight Safari extension that brings essential keyboard navigation to Reddit and Bluesky, inspired by Reddit Enhancement Suite.

## Features

Navigate Reddit and Bluesky with powerful keyboard shortcuts:

- **J** - Navigate down to the next post/comment
- **K** - Navigate up to the previous post/comment
- **H** - Hide the currently selected post/comment
- **C** - Open comments/post (same tab)
- **L** - Open link (new tab)
- **[** - Previous image in gallery (Reddit only)
- **]** - Next image in gallery (Reddit only)
- **?** - Toggle help menu with all keyboard shortcuts

**Automatic Features:**
- Selected post is highlighted with a blue outline for easy visibility
- Selection is restored when returning from comments page (using browser back button)
- Navigation is context-aware: J/K navigate from your current scroll position
- Videos automatically pause when navigating away from a post

**Reddit-Specific Features:**
- Navigate through both posts (on main feed) and comments (on comment pages)
- Media (images/videos) automatically opens when you select a post
- Media automatically closes when you navigate to a different post
- Promoted/sponsored posts are automatically hidden
- Navigate through image galleries/albums with [ and ] keys
- Subreddit custom styles are automatically blocked (uses default Reddit styling)

**Bluesky-Specific Features:**
- Navigate through your feed with keyboard shortcuts
- Open posts and external links quickly
- Visual highlighting of selected posts

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
   - Enable "Social Keyboard Navigator" in the extensions list

3. **Alternative: Convert to Safari App Extension**
   - Open Xcode
   - Create a new Safari Extension project
   - Copy the manifest.json, content.js, and styles.css files into the extension's Resources folder
   - Build and run the project

### For Safari on iOS (requires Safari 15+):

iOS Safari extensions require conversion to an app. Follow Apple's guide to create a Safari Web Extension using Xcode.

## Usage

### On Reddit (old.reddit.com):
1. Navigate to old.reddit.com
2. Press **?** to see the help menu with all available shortcuts
3. Press **J** to start navigating - the first post will be highlighted and its media will open automatically
4. Use **J** and **K** to move between posts (media opens/closes automatically on Reddit)
5. Press **C** to open the comments for the current post
6. Press **L** to open the link in a new tab
7. Press **H** to hide posts you're not interested in
8. For image galleries/albums:
   - Press **]** to open the first image (when viewing the grid)
   - Use **[** and **]** to navigate between images (when in gallery view)

### On Bluesky (bsky.app):
1. Navigate to bsky.app
2. Press **?** to see the help menu with all available shortcuts
3. Press **J** to start navigating - the first post will be highlighted
4. Use **J** and **K** to move between posts
5. Press **C** to open the full post page
6. Press **L** to open any external links in the post (or the post itself if no external links)
7. Press **H** to hide posts you don't want to see

The extension respects text input fields - keyboard shortcuts won't activate when you're typing in a text box or search field.

## Compatibility

**Supported Platforms:**
- **Reddit**: old.reddit.com only (not the redesign)
- **Bluesky**: bsky.app

**Browser Requirements:**
- Compatible with Safari 14+
- Tested on macOS Safari

## Why These Platforms?

**Old Reddit:**
- Stable and predictable DOM structure
- Cleaner, faster interface
- Many users prefer the classic Reddit experience
- Better support for media expansion features

**Bluesky:**
- Growing alternative social platform
- Clean, modern interface
- Benefits from keyboard navigation for power users

## Technical Details

The extension uses:
- Manifest V3 for modern Safari compatibility
- Pure JavaScript (no dependencies)
- CSS for visual highlighting
- Platform detection to adapt functionality
- Content scripts that run on old.reddit.com and bsky.app

## License

MIT License - feel free to modify and distribute.

## Troubleshooting

**Extension not working?**
- Make sure you're on a supported site:
  - old.reddit.com (not www.reddit.com or new Reddit)
  - bsky.app
- Check that the extension is enabled in Safari Settings → Extensions
- Try reloading the page
- Check the browser console for any error messages

**Shortcuts not responding?**
- Make sure you're not typing in a text field
- Try clicking on the page background first to ensure focus
- Press **?** to verify the extension loaded and see available shortcuts

**Visual highlighting not visible?**
- Check that Safari is allowing the extension's CSS to load
- Try disabling other extensions that might conflict
- Ensure you're not in a text input field

**Bluesky-specific issues:**
- If posts aren't being detected, the DOM structure may have changed
- Try refreshing the page
- Check that you're on the main feed (not in settings or other pages)
