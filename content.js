// Reddit Keyboard Navigator for Old Reddit
// Keyboard shortcuts for navigating and interacting with posts

(function() {
  'use strict';

  const SELECTED_CLASS = 'reddit-kb-nav-selected';
  let currentSelectedIndex = -1;
  let currentExpandedPost = null;

  // Get all post elements on the page
  function getPosts() {
    // In old Reddit, posts are .thing elements with .link class
    // Exclude promoted posts
    return Array.from(document.querySelectorAll('.thing.link:not(.hidden):not(.promoted)'));
  }

  // Hide all promoted posts
  function hidePromotedPosts() {
    const promotedPosts = document.querySelectorAll('.thing.promoted');
    promotedPosts.forEach(post => {
      post.style.display = 'none';
      post.classList.add('hidden');
    });
  }

  // Save the current selection to session storage
  function saveSelection() {
    const posts = getPosts();
    if (currentSelectedIndex >= 0 && currentSelectedIndex < posts.length) {
      const currentPost = posts[currentSelectedIndex];
      const postId = currentPost.getAttribute('data-fullname');
      if (postId) {
        sessionStorage.setItem('reddit-kb-nav-selected', postId);
        sessionStorage.setItem('reddit-kb-nav-url', window.location.href);
      }
    }
  }

  // Restore the previous selection from session storage
  function restoreSelection() {
    const savedUrl = sessionStorage.getItem('reddit-kb-nav-url');
    const savedPostId = sessionStorage.getItem('reddit-kb-nav-selected');

    // Only restore if we're on the same page we left from
    if (savedUrl === window.location.href && savedPostId) {
      const posts = getPosts();
      const index = posts.findIndex(post => post.getAttribute('data-fullname') === savedPostId);

      if (index !== -1) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          selectPost(index);
        }, 200);
      }

      // Clear the saved selection after restoring
      sessionStorage.removeItem('reddit-kb-nav-selected');
      sessionStorage.removeItem('reddit-kb-nav-url');
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

    const expando = post.querySelector('.expando-button');
    if (expando && expando.classList.contains('expanded')) {
      expando.click();
    }
  }

  // Open media for a post
  function openMedia(post) {
    if (!post) return;

    const expando = post.querySelector('.expando-button');
    if (expando && !expando.classList.contains('expanded')) {
      expando.click();
      return true;
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

    // Close media on the previously selected post
    if (currentExpandedPost) {
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
    if (hasMedia) {
      // Wait for media to expand, then scroll to it
      setTimeout(() => {
        const expando = selectedPost.querySelector('.expando');
        if (expando) {
          expando.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    } else {
      // No media, just scroll the post title into view
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
  }

  // Open comments for the currently selected post (C key)
  function openComments() {
    const posts = getPosts();
    if (currentSelectedIndex === -1 || currentSelectedIndex >= posts.length) return;

    const currentPost = posts[currentSelectedIndex];
    const commentsLink = currentPost.querySelector('a.comments');

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
    const titleLink = currentPost.querySelector('a.title');

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
    overlay.innerHTML = `
      <div class="reddit-kb-nav-help-content">
        <h3>Reddit Keyboard Navigator - Shortcuts</h3>
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
            <span>Open comments (same tab)</span>
          </div>
          <div class="reddit-kb-nav-shortcut">
            <kbd>L</kbd>
            <span>Open link (new tab)</span>
          </div>
          <div class="reddit-kb-nav-shortcut">
            <kbd>?</kbd>
            <span>Toggle this help menu</span>
          </div>
        </div>
        <p class="reddit-kb-nav-note">Media automatically opens/closes when navigating</p>
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
      case '?':
        event.preventDefault();
        toggleHelp();
        break;
    }
  }

  // Initialize
  function init() {
    // Hide promoted posts
    hidePromotedPosts();

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);

    // Restore previous selection if returning from comments/link
    restoreSelection();

    console.log('Reddit Keyboard Navigator loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
