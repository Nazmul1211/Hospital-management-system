// Smooth scrolling function
  function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
      behavior: 'smooth'
    });
  }

  // Add event listeners to menu links
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = e.target.getAttribute('href');
      smoothScroll(target);
    });
  });

// <----This code sets up smooth scrolling when clicking on the menu links. It prevents the default link behavior, identifies the target section using the href attribute, and then scrolls smoothly to that section. Remember to adjust the section IDs and menu items according to your page's structure. With these steps, clicking on the menu items should smoothly scroll to the corresponding sections of your one-page web page.---->
