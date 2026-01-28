# MSU-SND ROTC UNIT DOCUMENT REPOSITORY

A document management system for organizing incoming and outgoing documents for various sections of the MSU-SND ROTC UNIT.

## Features

- **Sections**:
  - Corp Commander
  - S1 - Personnel
  - S2 - Intelligence
  - S3 - Training & Operations
  - S4 - Logistics & Supply
  - S7 - CMO
- **Categories**: Incoming and Outgoing documents for each section.
- **File Management**: Upload and download files.

## Project Structure

- `server/`: Node.js backend for file storage and API.
  - `uploads/`: Directory where documents are stored physically.
- `client/`: React frontend application.

## How to Run

1. **Start the Backend**:
   ```bash
   cd server
   npm install # (only first time)
   node server.js
   ```
   The server runs on `http://localhost:5000`.

2. **Start the Frontend**:
   ```bash
   cd client
   npm install # (only first time)
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` (or similar port).

## Usage

1. Open the frontend URL in your browser.
2. Select a section from the sidebar.
3. Switch between "Incoming" and "Outgoing" tabs.
4. Use the "Upload Document" button to add files.
5. Click "Download" on any file to retrieve it.
