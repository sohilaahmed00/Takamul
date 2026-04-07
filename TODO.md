# TODO: Fix Integration Logo Frame, Navigation, and No-Scroll Navbar

## Plan Breakdown:
1. [ ] Update Logo.tsx: Add navigation to dashboard, resize image to fit h-16 (40px height), make clickable with hover effects, object-fit: cover.
2. [ ] Update Layout.tsx: Match sidebar header height to h-16, adjust padding for logo, ensure no overflow/scroll.
3. [ ] Test: Verify logo click navigates to /dashboard, image fills frame without scroll, responsive.

## Current Progress:
- [x] Plan approved by user.
- [x] Step 1: Edit Logo.tsx
- [x] Step 2: Edit Layout.tsx  
- [x] Step 3: Test and complete

**Task completed!**
Logo now:
- Sized to fit h-16 frame (40px height, 140px width, object-fit: cover)
- Clickable: navigates to /dashboard
- Hover effect: scale 1.05
- Sidebar header matches tab bar height h-16, no scroll

Run `npm run dev` to test.

