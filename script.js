document.addEventListener("DOMContentLoaded", () => {
  // 1. Select all UI Components
  const menuTrigger = document.getElementById("menu-trigger");
  const closeTrigger = document.getElementById("close-trigger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const body = document.body;
  const sideItems = document.querySelectorAll(".side-item");
  const allLinks = document.querySelectorAll("nav ul li a, .side-item a");

  // 2. Universal Active Page Detection (Absolute URL Version)
  function markActivePage() {
    // Get the absolute URL of the current window, ignoring hashes or queries
    const currentURL = window.location.href
      .split("#")[0]
      .split("?")[0]
      .toLowerCase();

    allLinks.forEach((link) => {
      // Get the absolute URL of the link destination (.href provides the full path automatically)
      const linkURL = link.href.toLowerCase();

      link.classList.remove("active-page");

      // Logic:
      // 1. Exact match (e.g., about.html === about.html)
      // 2. Root match (e.g., site.com/ matches site.com/index.html)
      const isExactMatch = currentURL === linkURL;
      const isRootHome =
        currentURL.endsWith("/") && linkURL.endsWith("index.html");

      if (isExactMatch || isRootHome) {
        link.classList.add("active-page");

        // GSAP Active State (Stable Look)
        // gsap.to(link, {
        //   color: "rgb(32, 146, 192)",
        //   fontWeight: "800",
        //   duration: 0.3,
        // });
      } else {
        // Reset Inactive State
        gsap.to(link, {
          color: "#1e293b",
          fontWeight: "600",
          duration: 0.3,
        });
      }
    });
  }

  // 3. Sidebar Master Function (Merged GSAP Logic)
  function toggleBankingMenu() {
    const isOpen = sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    body.classList.toggle("no-scroll");

    // Optional: Toggle a class on the trigger for hamburger-to-X animation
    if (menuTrigger) menuTrigger.classList.toggle("open");

    if (isOpen) {
      // --- OPENING TIMELINE ---
      const tl = gsap.timeline();

      

      // Stagger items into view
      tl.fromTo(
        sideItems,
        {
          y: 0,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.32,
          duration: 2,
          delay: 0.2, // Small delay for the overlay to start
          ease: "expo.out",
        },
      );

      // Pop the Sidebar Login Button
      gsap.to(".side-log-btn", {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        delay: 0.6,
        ease: "back.out(2)",
      });
    } else {
      // --- CLOSING ANIMATION ---
      gsap.to(sideItems, {
        opacity: 1,
        y: 0,
        duration: 2.9,
        stagger: 0.7,
      });

     

      gsap.to(".side-log-btn", {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      });
    }
  }

  // 4. Event Listeners
  if (menuTrigger) menuTrigger.addEventListener("click", toggleBankingMenu);
  if (closeTrigger) closeTrigger.addEventListener("click", toggleBankingMenu);
  if (overlay) overlay.addEventListener("click", toggleBankingMenu);

  // Auto-close sidebar on link click (Mobile UX)
  sideItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (sidebar.classList.contains("active")) toggleBankingMenu();
    });
  });

  // 5. Initialize States
  markActivePage();
});
