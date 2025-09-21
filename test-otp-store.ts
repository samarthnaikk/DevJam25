// This is a simple test script to check if our OTP singleton is working correctly
import { otpStore } from "./lib/otp/store";

// First test - set an OTP
console.log("Setting test OTP...");
otpStore.setOtp("test@example.com", "123456", { name: "Test User" }, 15);

// Second test - retrieve the OTP
console.log("Retrieving test OTP...");
const data = otpStore.getOtp("test@example.com");
console.log("Retrieved data:", data);

// Third test - check all stored emails
console.log("All stored emails:", otpStore.getStoredEmails());

// Fourth test - remove the OTP
console.log("Removing test OTP...");
otpStore.removeOtp("test@example.com");

// Final check
console.log("All stored emails after removal:", otpStore.getStoredEmails());

console.log("Test complete!");
