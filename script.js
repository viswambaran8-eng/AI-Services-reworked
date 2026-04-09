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








// industry tract service page
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".marquee-track");
  const container = document.querySelector(".industry-marquee-container");
  const contentSet = document.querySelector(".marquee-content");

  let scrollPos = 0;
  let isPaused = false;
  let isDragging = false;
  let startX, dragScrollPos;
  
  const autoSpeed = 1.2; // Speed of auto-scroll
  let setWidth = contentSet.offsetWidth;

  // --- 1. Animation Loop ---
  function animate() {
    if (!isPaused && !isDragging) {
      scrollPos -= autoSpeed;
      
      // Infinite Reset Logic
      if (Math.abs(scrollPos) >= setWidth) {
        scrollPos = 0;
      }
      
      track.style.transform = `translateX(${scrollPos}px)`;
    }
    requestAnimationFrame(animate);
  }

  // --- 2. Manual Drag/Scroll Logic ---
  const startDrag = (e) => {
    isDragging = true;
    isPaused = true;
    // Handle both mouse and touch events
    startX = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
    dragScrollPos = scrollPos;
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
    const walk = x - startX;
    
    scrollPos = dragScrollPos + walk;

    // Boundary check for infinite feel during drag
    if (scrollPos > 0) scrollPos = -setWidth;
    if (Math.abs(scrollPos) >= setWidth) scrollPos = 0;

    track.style.transform = `translateX(${scrollPos}px)`;
  };

  const stopDrag = () => {
    isDragging = false;
    isPaused = false;
  };

  // --- 3. Event Listeners ---
  // Mouse Events
  container.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", stopDrag);

  // Touch Events (Mobile/Tab)
  container.addEventListener("touchstart", startDrag);
  container.addEventListener("touchmove", moveDrag);
  container.addEventListener("touchend", stopDrag);

  // Hover Pause (Optional - remove if you only want drag-to-pause)
  container.addEventListener("mouseenter", () => (isPaused = true));
  container.addEventListener("mouseleave", () => {
    if(!isDragging) isPaused = false;
  });

  // Re-calculate on resize
  window.addEventListener("resize", () => {
    setWidth = contentSet.offsetWidth;
  });

  animate();
});