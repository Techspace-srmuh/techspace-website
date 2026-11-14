# TechSpace Website

The website for TechSpace, the student developer community at SRM University Delhi-NCR, Sonipat. It showcases the community, technical domains, events, team, and ways to join.

## Run locally

Use Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production build, run:

```bash
npm run build
npm run start
```

The `predev` and `prebuild` scripts generate gallery data from the event photos in `public/assets/gallery`.

## Built with

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js, GSAP, and Lenis. Motion effects respect the visitor's reduced-motion setting.
