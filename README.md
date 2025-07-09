Interactive Personal Portfolio
This is a fully responsive and interactive Single-Page Application (SPA) built to serve as my personal portfolio. The project was developed not just to showcase my work, but to be a demonstration of my front-end development skills, featuring a modern component-based architecture, rich animations, and a polished user interface.

Live Demo: https://jpclow3.github.io/Portfolio/

✨ Key Features
This project goes beyond a static page, incorporating a range of modern web features:

🎨 Dynamic Theming: A fully functional Light/Dark mode that persists across sessions, with all components adapting to the selected theme.

🌐 Bilingual Support: The entire site's content can be toggled between English (EN) and Portuguese (PT).

✨ Rich Animations & Interactions:

GSAP-Powered Animations: A custom timeline for the "Experience" section and an animated CardSwap component for the "Skills" section, built with the GreenSock Animation Platform (GSAP).

3D Tilt Effect: The profile card features a 3D tilt effect that reacts to the user's mouse movement.

Custom Cursor: A custom-made cursor that provides visual feedback when hovering over interactive elements.

Reactive Background: A dynamic dot-grid background, rendered on an HTML Canvas, that interacts with the mouse pointer.

🧩 Component-Based Architecture: Built with React, the application is highly modular, with each section and UI element encapsulated in its own component for better organization and reusability.

Easter Egg: Includes a "Konami Code" easter egg that triggers a confetti animation.

🛠️ Tech Stack
The project was built using a modern front-end stack:

Framework: React.js

Styling: Tailwind CSS

Animations: GSAP (GreenSock)

Deployment: GitHub Pages

Development Tools: Create React App, ESLint, Prettier

🚀 Getting Started
To run this project locally, follow these steps:

Prerequisites
Make sure you have Node.js (which includes npm) installed on your machine.

Installation
Clone the repository:

git clone https://github.com/JPClow3/Portfolio.git

Navigate to the project directory:

cd Portfolio

Install the dependencies:

npm install

Running the Application
Once the dependencies are installed, you can run the application in development mode:

npm start

This will open the project in your default browser at http://localhost:3000. The page will automatically reload if you make any changes to the code.

Building for Production
To create an optimized production build, run:

npm run build

This command bundles the app into static files in the build folder.

📜 Acknowledgements
During the development process, I consulted various resources for inspiration and best practices. A special mention goes to React Bits, which served as an excellent reference for common React patterns and component examples.
