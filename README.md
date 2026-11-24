# Salt Stone Wardens — Foundation v0.1

A mobile-first, premium dark-fantasy browser game foundation.

## Run locally
Because the game uses JavaScript modules, run it from a local web server rather than opening `index.html` as a file.

- Python: `python -m http.server 8000`
- Open `http://localhost:8000`

## Publish with GitHub Pages
1. Create a new GitHub repository (for example, `salt-stone-wardens`).
2. Upload the contents of this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then Save.
6. Open the published URL on your iPhone and use **Share → Add to Home Screen**.

## Included in v0.1
- Bastion, Company, World, Missions and Chronicle screens
- Initial named characters and regional factions
- Resource display and recruit action
- Game clock: one real minute equals one game hour
- Pause, normal and fast time settings
- Local persistence using IndexedDB with localStorage fallback
- Offline elapsed-time catch-up (capped at 24 real hours)
- Save export/import
- Basic PWA manifest and service worker

## Current limits
- No expeditions or combat yet
- Facilities are informational in this milestone
- No cloud save or account sync
- The world map is a stylized overview, not a navigable simulation

## Next milestone
Implement expedition setup, squad selection, travel/encounter simulation, automatic combat resolution and post-mission reports.
