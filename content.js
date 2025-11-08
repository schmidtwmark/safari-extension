// Reddit Keyboard Navigator for Old Reddit
// J: Navigate down, K: Navigate up, H: Hide post

(function() {
  'use strict';

  const SELECTED_CLASS = 'reddit-kb-nav-selected';
  let currentSelectedIndex = -1;

  // Get all post elements on the page
  function getPosts() {
    // In old Reddit, posts are .thing elements with .link class
    return Array.from(document.querySelectorAll('.thing.link:not(.hidden)'));
  }

  // Remove selection highlight from all posts
  function clearSelection() {
    const posts = getPosts();
    posts.forEach(post => post.classList.remove(SELECTED_CLASS));
  }

  // Select a post by index
  function selectPost(index) {
    const posts = getPosts();

    if (posts.length === 0) return;

    // Clamp index to valid range
    if (index < 0) index = 0;
    if (index >= posts.length) index = posts.length - 1;

    clearSelection();
    currentSelectedIndex = index;

    const selectedPost = posts[index];
    selectedPost.classList.add(SELECTED_CLASS);

    // Scroll the selected post into view
    selectedPost.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
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

  // Handle keyboard events
  function handleKeyPress(event) {
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
    }
  }

  // Initialize
  function init() {
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);

    console.log('Reddit Keyboard Navigator loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
