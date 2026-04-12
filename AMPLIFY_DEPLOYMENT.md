# Amplify Deployment Notes

This workspace is configured for a single hosted shell URL on Amazon Amplify.

The build flow is:

1. Build each Angular remote app.
2. Run `node scripts/stage-remotes.mjs`.
3. Build `yakshit-chawla-portfolio`.
4. Amplify hosts `yakshit-chawla-portfolio/dist/shell-portfolio/browser`.

The staging script copies remote bundles into `yakshit-chawla-portfolio/frontend/public/remotes/*` and rewrites the shell manifest to same-origin paths such as `/remotes/skyfare/remoteEntry.json`.

SkyFare backend note:

The SkyFare search UI works from the remote frontend, and dummy bookings post to `http://localhost:4300/api/flights/bookings` in local development. For production, the Express/Mongo backend should be deployed separately, and the frontend API base URL should be moved from localhost to that deployed backend URL. MongoDB should also use a hosted connection string, such as MongoDB Atlas, because `mongodb://localhost:27017/` will not exist in Amplify hosting.
