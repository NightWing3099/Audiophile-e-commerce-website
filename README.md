# Audiophile E-Commerce Website

A fully responsive, multi-page e-commerce storefront for premium audio gear. Built as a portfolio project to demonstrate modern frontend development skills, attention to UX detail, and clean, maintainable code.

![Design preview for the Audiophile e-commerce website](./preview.jpg)

## Live Demo

- **Live Site:** [https://nightwing3099.github.io/Audiophile-e-commerce-website/](https://nightwing3099.github.io/Audiophile-e-commerce-website/)
- **Repository:** [https://github.com/NightWing3099/Audiophile-e-commerce-website](https://github.com/NightWing3099/Audiophile-e-commerce-website)

## Project Overview

This project is a complete implementation of a premium e-commerce experience, including:

- Responsive landing, category, product detail, and checkout pages
- Persistent shopping cart with add/remove/quantity controls
- Client-side checkout form validation
- Order confirmation modal with summary
- Mobile-first, accessible UI with keyboard and overlay interactions

## Tech Stack

- **HTML5** — semantic, accessible markup
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Vanilla JavaScript (ES Modules)** — cart state, checkout logic, and DOM interactions
- **localStorage** — persistent cart state across sessions
- **npm** — dependency and script management

## Key Features

- **Responsive Design:** Optimized layouts for mobile, tablet, and desktop using Tailwind CSS.
- **Persistent Cart:** Cart contents survive page refreshes via `localStorage`.
- **Checkout Validation:** Real-time form validation with user-friendly error states.
- **Order Summary:** Accurate totals including shipping and VAT calculations.
- **Accessible Interactions:** Keyboard support (e.g., Escape to close cart), focusable controls, and semantic HTML.

## Project Structure

```
.
├── index.html                  # Homepage
├── headphones.html             # Category page
├── speakers.html               # Category page
├── earphones.html              # Category page
├── product-*.html              # Individual product detail pages
├── checkout.html               # Checkout page
├── css/
│   ├── input.css               # Tailwind entry + custom theme
│   └── output.css              # Generated stylesheet
├── src/
│   ├── cart.js                 # Cart state, persistence, and modal UI
│   └── checkout.js             # Checkout summary, validation, and confirmation
├── assets/                     # Product images, icons, and favicon
├── starter-code/               # Original challenge starter files
├── package.json
└── README.md
```

## Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Build the CSS
npm run build:css

# Or watch for changes during development
npm run watch:css
```

Then open `index.html` in your browser or serve the directory with a local static server.

## What This Project Demonstrates

- Building a polished, production-like UI from a design brief
- Managing client-side state without a framework
- Writing modular, reusable JavaScript with ES modules
- Implementing accessible, responsive layouts
- Following a consistent design system with custom Tailwind theme extensions

## License

This project is based on a [Frontend Mentor](https://www.frontendmentor.io) premium challenge and is intended for portfolio and educational use.
