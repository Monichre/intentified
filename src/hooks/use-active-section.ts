import { useState, useEffect } from "react";

export function useActiveSection(sections: string[]) {
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    // Set initial hash or default to first section
    const initialHash = window.location.hash;
    setActiveHash(initialHash || `#${sections[0].toLowerCase()}`);

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && sections.map((s) => `#${s.toLowerCase()}`).includes(hash)) {
        setActiveHash(hash);
      }
    };

    const handleScroll = () => {
      // Debounce scroll events
      const debounced = setTimeout(() => {
        // Check if we're at the top of the page
        if (window.scrollY === 0 && sections.length > 0) {
          const homeHash = `#${sections[0].toLowerCase()}`;
          if (activeHash !== homeHash) {
            window.history.replaceState(null, "", homeHash);
            setActiveHash(homeHash);
          }
          return;
        }

        const sectionElements = sections.map((section) => ({
          id: section.toLowerCase(),
          element: document.querySelector(`#${section.toLowerCase()}`),
        }));

        // Find the current section in view
        const currentSection = sectionElements.find(({ element }) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          // Consider a section active when it's near the top of the viewport
          // with some buffer for better UX
          return rect.top <= 150 && rect.bottom >= 150;
        });

        if (currentSection) {
          const newHash = `#${currentSection.id}`;
          if (newHash !== activeHash) {
            // Update URL hash without scrolling
            window.history.replaceState(null, "", newHash);
            setActiveHash(newHash);
          }
        }
      }, 100); // Debounce time

      return () => clearTimeout(debounced);
    };

    // Add event listeners
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check for active section
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections, activeHash]);

  return { activeHash };
}
