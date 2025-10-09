# File Details

## index.html

### CSS Styles

These styles define the visual theme for the main landing page. Key aspects include:
- **Body Styling**: Sets a dark background (`#0d1117`), light text (`#c9d1d9`), and uses the 'Inter' font.
- **Font-mono**: Applies 'Fira Code' to headings and code-like elements.
- **Panel Glassmorphism Effect**: Creates a semi-transparent, blurred background with a subtle border and shadow for panels, giving them a "glass" look.
- **Accent Colors**: Defines an accent color (`#58a6ff`) for glowing text and borders.
- **Primary Button Styling**: Sets the primary button's appearance with a green background (`#238636`), white text, and hover effects that include a slight lift and increased shadow.
- **Scroll Reveal Animations**: Implements a `reveal` class for elements that animate into view when scrolled, fading in and sliding up.
- **Custom Scrollbar**: Styles the horizontal scrollbar for the projects section, giving it a dark track and a green thumb that brightens on hover.
- **Particles.js Container**: Positions the Particles.js background to cover the entire section while maintaining proper z-indexing.
- **Navigation Link Styling**: Styles navigation links with a transition effect, padding, and rounded borders. Active and hovered links receive a glassmorphism background, a blue accent color, and a shadow.

### JavaScript Functions

This script executes once the DOM is fully loaded. It handles several interactive features:
- **Particles.js Initialization**: Configures a particle animation background for visual appeal, setting parameters like particle count, color, shape, opacity, size, line linking, and movement. Interactivity is enabled for 'grab' mode on hover.
- **Scroll Reveal Animation**: Implements a scroll-triggered animation that makes elements with the `reveal` class fade in and slide up when they become visible in the viewport. It uses an `IntersectionObserver` to detect when elements enter the view.
- **Sticky Navbar Background on Scroll**: Dynamically applies a 'panel' class to the navigation bar (`#navbar`) when the user scrolls down past a certain threshold (50 pixels) and past the hero section, giving it a distinct background effect.
- **Active Nav Link on Scroll**: Highlights the currently active navigation link in the header based on the user's scroll position. It uses an `IntersectionObserver` to determine which section is currently in view and applies the `active-nav-link` class to the corresponding navigation item, while removing it from others.
- **Navbar Loading**: Fetches `section/navbar.html` and inserts its content into the `#navbar-placeholder` div, effectively loading the shared navigation bar.

## about-me/courses.html

### HTML Structure

This file defines the HTML structure for the 'Graduate Course Showcase' page. Key components include:
- **Navigation Bar**: A responsive navigation bar with brand, desktop links (Home, Projects), social media links (GitHub, LinkedIn, YouTube, Email), and a mobile menu button. The mobile menu is initially hidden and toggles visibility.
- **Header Section**: Contains the main title "My Graduate Coursework" and a descriptive paragraph about the course showcase.
- **Search and View Controls**: Provides an input field for searching courses by name, subject, or school, and buttons to toggle between grid and list views for displaying courses.
- **Courses Container**: A `div` with `id="courses-container"` where course cards will be dynamically inserted by JavaScript.
- **No Results Message**: A hidden `div` with `id="no-results"` that is displayed when no courses are found based on the search term.
- **Script Imports**: Imports `courses.js` for course-specific functionality and `navbar.js` for navigation bar behavior.

## about-me/css/courses.css

### CSS Styles

This stylesheet primarily defines custom styles for the 'Graduate Course Showcase' page, focusing on typography and school-specific color themes:
- **Font Family**: Sets the default font for the body to 'Inter'.
- **School Color Themes**: Defines several CSS variables (`--school-primary`, `--school-secondary`) for different universities (FSU, UD, JHU, MIT, Wharton, and a default theme). These variables are used to apply consistent branding colors to course elements associated with each institution.

## about-me/javascript/courses.js

### JavaScript Functions

This script is responsible for dynamically loading, filtering, and displaying course information from a CSV file. It includes the following key functions and logic:
- **`parseCSV(csv)`**: A utility function that takes a CSV string as input and converts it into an array of JavaScript objects, where each object represents a course. It correctly handles CSV formatting, including quoted fields and commas within data.
- **`tagColors` and `colorPalette`**: These variables manage the dynamic assignment of colors to course subject tags. `colorPalette` holds an array of Tailwind CSS classes for different color schemes.
- **`getTagColor(subject)`**: This function ensures that each unique course subject receives a consistent color. If a subject hasn't been assigned a color yet, it picks the next available color from the `colorPalette` and stores it.
- **`renderCourses(coursesToRender)`**: This core function takes an array of course objects and renders them into the `courses-container` on the HTML page. It dynamically applies either a grid or list layout based on the `currentView` variable. It also assigns school-specific primary and secondary colors and displays course modality (e.g., "In-Progress", "Online", "In-Person") and credit status (e.g., "For Credit", "No Credit", "Audited") with appropriate icons.
- **`setView(view)`**: Toggles between 'grid' and 'list' views for the course display. It updates the `currentView` variable, changes the styling of the view buttons, and then triggers a re-render of the courses using `handleSearch()` to reflect the new layout.
- **`handleSearch()`**: Filters the `courses` array based on the text entered in the `searchInput`. It searches for matches in the course title, subject, or school name (case-insensitive) and then calls `renderCourses()` to display the filtered results.
- **`DOMContentLoaded` Event Listener**: This is the main execution block that runs when the page loads:
    - It fetches course data from `../../data/Courses.csv`.
    - The fetched CSV data is parsed using `parseCSV`.
    - Courses are reversed to display the most recent ones first.
    - Event listeners are attached to the search input (`searchInput`) and the view toggle buttons (`gridViewBtn`, `listViewBtn`) to trigger `handleSearch` and `setView` respectively.
    - An initial render of all courses is performed.
    - Includes robust error handling to inform the user if course data cannot be loaded.


