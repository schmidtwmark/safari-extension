// Social Keyboard Navigator for Reddit and Bluesky
// Keyboard shortcuts for navigating and interacting with posts

(function() {
  'use strict';

  const SELECTED_CLASS = 'reddit-kb-nav-selected';
  let currentSelectedIndex = -1;
  let currentExpandedPost = null;

  // Detect which platform we're on
  const isReddit = window.location.hostname.includes('reddit.com');
  const isBluesky = window.location.hostname.includes('bsky.app');

  // Get all post elements on the page
  function getPosts() {
    if (isReddit) {
      // In old Reddit, posts are .thing elements with .link class
      // Exclude promoted posts
      return Array.from(document.querySelectorAll('.thing.link:not(.hidden):not(.promoted)'));
    } else if (isBluesky) {
      // In Bluesky, posts are in feed items
      // Look for posts that have the post structure (avatar, content, etc.)
      const posts = Array.from(document.querySelectorAll('[data-testid^="feedItem-"]'));
      if (posts.length > 0) return posts;

      // Fallback: try to find posts by their common structure
      // Bluesky posts typically have a specific div structure in the feed
      return Array.from(document.querySelectorAll('div[style*="padding"]')).filter(el => {
        // Check if it looks like a post (has text content and is in the feed)
        return el.querySelector('a[href*="/profile/"]') &&
               el.querySelector('div[style*="overflow-wrap"]');
      });
    }
    return [];
  }

  // Hide all promoted posts
  function hidePromotedPosts() {
    if (isReddit) {
      const promotedPosts = document.querySelectorAll('.thing.promoted');
      promotedPosts.forEach(post => {
        post.style.display = 'none';
        post.classList.add('hidden');
      });
    }
    // Bluesky doesn't have promoted posts in the same way
  }

  // Get a unique identifier for a post
  function getPostId(post) {
    if (isReddit) {
      return post.getAttribute('data-fullname');
    } else if (isBluesky) {
      // For Bluesky, try to get a unique identifier from the post link or content
      const postLink = post.querySelector('a[href*="/post/"]');
      if (postLink) {
        return postLink.getAttribute('href');
      }
      // Fallback: use text content hash
      const textContent = post.textContent.trim().substring(0, 100);
      return textContent;
    }
    return null;
  }

  // Save the current selection to session storage
  function saveSelection() {
    const posts = getPosts();
    if (currentSelectedIndex >= 0 && currentSelectedIndex < posts.length) {
      const currentPost = posts[currentSelectedIndex];
      const postId = getPostId(currentPost);
      if (postId) {
        sessionStorage.setItem('social-kb-nav-selected', postId);
        sessionStorage.setItem('social-kb-nav-url', window.location.href);
      }
    }
  }

  // Restore the previous selection from session storage
  function restoreSelection() {
    const savedUrl = sessionStorage.getItem('social-kb-nav-url');
    const savedPostId = sessionStorage.getItem('social-kb-nav-selected');

    // Only restore if we're on the same page we left from
    if (savedUrl === window.location.href && savedPostId) {
      const posts = getPosts();
      const index = posts.findIndex(post => getPostId(post) === savedPostId);

      if (index !== -1) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          selectPost(index);
        }, 200);
      }

      // Clear the saved selection after restoring
      sessionStorage.removeItem('social-kb-nav-selected');
      sessionStorage.removeItem('social-kb-nav-url');
    }
  }

  // Remove selection highlight from all posts
  function clearSelection() {
    const posts = getPosts();
    posts.forEach(post => post.classList.remove(SELECTED_CLASS));
  }

  // Close media for a post
  function closeMedia(post) {
    if (!post) return;

    if (isReddit) {
      const expando = post.querySelector('.expando-button');
      if (expando && expando.classList.contains('expanded')) {
        expando.click();
      }
    } else if (isBluesky) {
      // Bluesky media is typically always visible, but we can try to collapse it
      const mediaButton = post.querySelector('button[aria-label*="Show"]');
      if (mediaButton) {
        // This might not work for all cases, but it's a reasonable attempt
      }
    }
  }

  // Open media for a post
  function openMedia(post) {
    if (!post) return false;

    if (isReddit) {
      const expando = post.querySelector('.expando-button');
      if (expando && !expando.classList.contains('expanded')) {
        expando.click();
        return true;
      }
    } else if (isBluesky) {
      // Bluesky typically shows media inline, check if post has media
      const hasImage = post.querySelector('img[src*="cdn.bsky.app"]');
      const hasVideo = post.querySelector('video');
      return !!(hasImage || hasVideo);
    }
    return false;
  }

  // Select a post by index
  function selectPost(index) {
    const posts = getPosts();

    if (posts.length === 0) return;

    // Clamp index to valid range
    if (index < 0) index = 0;
    if (index >= posts.length) index = posts.length - 1;

    // Close media on the previously selected post (Reddit only)
    if (currentExpandedPost && isReddit) {
      closeMedia(currentExpandedPost);
    }

    clearSelection();
    currentSelectedIndex = index;

    const selectedPost = posts[index];
    selectedPost.classList.add(SELECTED_CLASS);

    // Auto-open media for the newly selected post
    const hasMedia = openMedia(selectedPost);
    currentExpandedPost = selectedPost;

    // Scroll to center the media if it exists, otherwise center the post
    if (isReddit && hasMedia) {
      // Wait for media to expand, then scroll to it
      setTimeout(() => {
        const expando = selectedPost.querySelector('.expando');
        if (expando) {
          expando.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          selectedPost.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    } else {
      // For Bluesky or posts without media, scroll the post into view
      selectedPost.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  // Navigate to the next post (J key)
  function navigateDown() {
    const posts = getPosts();
    if (posts.length === 0) return;

    if (currentSelectedIndex === -1) {
      // No selection yet, select the first post
      selectPost(0);
    } else {
      // Move to next post
      selectPost(currentSelectedIndex + 1);
    }
  }

  // Navigate to the previous post (K key)
  function navigateUp() {
    const posts = getPosts();
    if (posts.length === 0) return;

    if (currentSelectedIndex === -1) {
      // No selection yet, select the first post
      selectPost(0);
    } else {
      // Move to previous post
      selectPost(currentSelectedIndex - 1);
    }
  }

  // Hide the currently selected post (H key)
  function hideCurrentPost() {
    const posts = getPosts();
    if (currentSelectedIndex === -1 || currentSelectedIndex >= posts.length) return;

    const currentPost = posts[currentSelectedIndex];

    if (isReddit) {
      // Find the hide button and click it
      const hideButton = currentPost.querySelector('.hide-button a, a.hide-button');

      if (hideButton) {
        // Click the hide button
        hideButton.click();

        // After hiding, move to the next post
        setTimeout(() => {
          // The post list has changed, so we need to recalculate
          const newPosts = getPosts();
          if (newPosts.length > 0) {
            // Stay at the same index (which is now the next post)
            if (currentSelectedIndex >= newPosts.length) {
              currentSelectedIndex = newPosts.length - 1;
            }
            selectPost(currentSelectedIndex);
          } else {
            currentSelectedIndex = -1;
          }
        }, 100);
      } else {
        // Fallback: just hide the element manually
        currentPost.style.display = 'none';

        setTimeout(() => {
          const newPosts = getPosts();
          if (newPosts.length > 0) {
            if (currentSelectedIndex >= newPosts.length) {
              currentSelectedIndex = newPosts.length - 1;
            }
            selectPost(currentSelectedIndex);
          } else {
            currentSelectedIndex = -1;
          }
        }, 100);
      }
    } else if (isBluesky) {
      // For Bluesky, just hide the post visually
      currentPost.style.display = 'none';
      currentPost.classList.add('hidden');

      setTimeout(() => {
        const newPosts = getPosts();
        if (newPosts.length > 0) {
          if (currentSelectedIndex >= newPosts.length) {
            currentSelectedIndex = newPosts.length - 1;
          }
          selectPost(currentSelectedIndex);
        } else {
          currentSelectedIndex = -1;
        }
      }, 100);
    }
  }

  // Open comments for the currently selected post (C key)
  function openComments() {
    const posts = getPosts();
    if (currentSelectedIndex === -1 || currentSelectedIndex >= posts.length) return;

    const currentPost = posts[currentSelectedIndex];
    let commentsLink = null;

    if (isReddit) {
      commentsLink = currentPost.querySelector('a.comments');
    } else if (isBluesky) {
      // On Bluesky, find the link to the post itself
      commentsLink = currentPost.querySelector('a[href*="/post/"]');
      // Or look for a timestamp link which usually goes to the post
      if (!commentsLink) {
        commentsLink = currentPost.querySelector('a[href*="/profile/"][href*="/post/"]');
      }
    }

    if (commentsLink) {
      // Save selection before navigating
      saveSelection();
      window.location.href = commentsLink.href;
    }
  }

  // Open the link for the currently selected post (L key)
  function openLink() {
    const posts = getPosts();
    if (currentSelectedIndex === -1 || currentSelectedIndex >= posts.length) return;

    const currentPost = posts[currentSelectedIndex];
    let titleLink = null;

    if (isReddit) {
      titleLink = currentPost.querySelector('a.title');
    } else if (isBluesky) {
      // On Bluesky, look for external links in the post
      const links = currentPost.querySelectorAll('a[href]');
      // Find the first external link (not a profile or post link)
      for (const link of links) {
        const href = link.getAttribute('href');
        if (href && !href.includes('bsky.app') && !href.startsWith('/')) {
          titleLink = link;
          break;
        }
      }
      // If no external link, open the post itself
      if (!titleLink) {
        titleLink = currentPost.querySelector('a[href*="/post/"]');
      }
    }

    if (titleLink) {
      window.open(titleLink.href, '_blank');
    }
  }

  // Toggle help overlay (? key)
  function toggleHelp() {
    let helpOverlay = document.getElementById('reddit-kb-nav-help');

    if (helpOverlay) {
      helpOverlay.remove();
    } else {
      createHelpOverlay();
    }
  }

  // Create help overlay
  function createHelpOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'reddit-kb-nav-help';
    const platformName = isReddit ? 'Reddit' : isBluesky ? 'Bluesky' : 'Social';
    const mediaNote = isReddit ? 'Media automatically opens/closes when navigating (Reddit only)' : 'Navigate posts with keyboard shortcuts';

    // Build gallery shortcuts for Reddit
    const galleryShortcuts = isReddit ? `
      <div class="reddit-kb-nav-shortcut">
        <kbd>[</kbd>
        <span>Previous image in gallery</span>
      </div>
      <div class="reddit-kb-nav-shortcut">
        <kbd>]</kbd>
        <span>Next image in gallery</span>
      </div>
    ` : '';

    overlay.innerHTML = `
      <div class="reddit-kb-nav-help-content">
        <h3>${platformName} Keyboard Navigator - Shortcuts</h3>
        <div class="reddit-kb-nav-shortcuts">
          <div class="reddit-kb-nav-shortcut">
            <kbd>J</kbd>
            <span>Navigate to next post</span>
          </div>
          <div class="reddit-kb-nav-shortcut">
            <kbd>K</kbd>
            <span>Navigate to previous post</span>
          </div>
          <div class="reddit-kb-nav-shortcut">
            <kbd>H</kbd>
            <span>Hide current post</span>
          </div>
          <div class="reddit-kb-nav-shortcut">
            <kbd>C</kbd>
            <span>Open ${isBluesky ? 'post' : 'comments'} (same tab)</span>
          </div>
          <div class="reddit-kb-nav-shortcut">
            <kbd>L</kbd>
            <span>Open link (new tab)</span>
          </div>
          ${galleryShortcuts}
          <div class="reddit-kb-nav-shortcut">
            <kbd>?</kbd>
            <span>Toggle this help menu</span>
          </div>
        </div>
        <p class="reddit-kb-nav-note">${mediaNote}</p>
        <p class="reddit-kb-nav-close">Press <kbd>?</kbd> or <kbd>ESC</kbd> to close</p>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close on click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  // Navigate to previous image in Reddit gallery ([ key)
  function galleryPrevious() {
    if (!isReddit) return;

    // Look for the visible gallery preview (the one currently showing an image)
    const visiblePreview = document.querySelector('.gallery-preview:not([style*="display: none"])');
    if (!visiblePreview) return;

    // We're in gallery view, navigate to previous image
    const prevButton = visiblePreview.querySelector('.gallery-nav-prev:not(.gallery-nav-disabled)');
    if (prevButton) {
      prevButton.click();
    }
  }

  // Navigate to next image in Reddit gallery (] key)
  function galleryNext() {
    if (!isReddit) return;

    // Look for the visible gallery preview (the one currently showing an image)
    const visiblePreview = document.querySelector('.gallery-preview:not([style*="display: none"])');

    if (visiblePreview) {
      // We're in gallery view, navigate to next image
      const nextButton = visiblePreview.querySelector('.gallery-nav-next:not(.gallery-nav-disabled)');
      if (nextButton) {
        nextButton.click();
      }
    } else {
      // We're in grid view, open the first thumbnail
      const galleryGrid = document.querySelector('.gallery-tiles');
      if (galleryGrid) {
        const firstTile = galleryGrid.querySelector('.gallery-tile.gallery-navigation');
        if (firstTile) {
          firstTile.click();
        }
      }
    }
  }

  // Handle keyboard events
  function handleKeyPress(event) {
    // Allow ESC to close help overlay
    if (event.key === 'Escape') {
      const helpOverlay = document.getElementById('reddit-kb-nav-help');
      if (helpOverlay) {
        helpOverlay.remove();
        event.preventDefault();
        return;
      }
    }

    // Don't trigger if user is typing in an input field
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    )) {
      return;
    }

    // Check for our keyboard shortcuts
    const key = event.key.toLowerCase();

    switch(key) {
      case 'j':
        event.preventDefault();
        navigateDown();
        break;
      case 'k':
        event.preventDefault();
        navigateUp();
        break;
      case 'h':
        event.preventDefault();
        hideCurrentPost();
        break;
      case 'c':
        event.preventDefault();
        openComments();
        break;
      case 'l':
        event.preventDefault();
        openLink();
        break;
      case '[':
        event.preventDefault();
        galleryPrevious();
        break;
      case ']':
        event.preventDefault();
        galleryNext();
        break;
      case '?':
        event.preventDefault();
        toggleHelp();
        break;
    }
  }

  // Initialize
  function init() {
    // Only proceed if we're on a supported platform
    if (!isReddit && !isBluesky) {
      return;
    }

    // Hide promoted posts
    hidePromotedPosts();

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);

    // Restore previous selection if returning from comments/link
    restoreSelection();

    const platformName = isReddit ? 'Reddit' : isBluesky ? 'Bluesky' : 'Social';
    console.log(`${platformName} Keyboard Navigator loaded`);
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
