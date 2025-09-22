"use client";

// Helper function to navigate to admin route with multiple fallbacks
export function navigateToAdmin() {
  console.log("Attempting to navigate to admin page with fallbacks");

  try {
    // Try different navigation methods
    setTimeout(() => {
      console.log("Trying window.location.replace");
      window.location.replace("/admin");

      // If that fails, try a different method after a delay
      setTimeout(() => {
        console.log("Fallback: Trying window.location.href");
        window.location.href = "/admin";

        // Last resort
        setTimeout(() => {
          console.log("Last resort: Trying full URL");
          window.location.href = `${window.location.origin}/admin`;
        }, 100);
      }, 100);
    }, 200);
  } catch (error) {
    console.error("Navigation error:", error);
    // Direct fallback
    window.location.href = "/admin";
  }
}
