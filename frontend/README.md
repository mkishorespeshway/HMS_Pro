# Getting Started with Vite

This project has been migrated from Create React App to [Vite](https://vitejs.dev/).

## Available Scripts

In the project directory, you can run:

### `npm start` or `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run preview`

Locally preview the production build.

## Migration Details

- Build tool: Vite
- Plugin: @vitejs/plugin-react
- Port: 3000 (configured in `vite.config.js`)
- Environment Variables: Migrated from `REACT_APP_` to `VITE_` and `process.env` to `import.meta.env`.
