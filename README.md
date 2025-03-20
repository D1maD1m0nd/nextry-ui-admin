# Nextry UI Admin

## Development

### Prerequisites
- Node.js (v16 or higher)
- Rust (latest stable)
- Tauri CLI (`npm install -g @tauri-apps/cli`)

### Installation
```bash
npm install
```

### Running the app
```bash
npm run tauri dev
```

## Building and Signing

### Generate signing key (Windows)
```bash
# Generate private key for Windows
npx @tauri-apps/cli signer generate -w .tauri/nextry.key
```

### Build the app
```bash
npm run tauri build
```

## Updating

### Update Process
1. Increment the version in `package.json` and `src-tauri/tauri.conf.json`
2. Build the application
3. Sign the update
4. Deploy the update

### Configuration
The updater configuration is in `src-tauri/tauri.conf.json`:
```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": ["https://your-update-server.com/api/updates"],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

### Security
- Keep your private key (`.tauri/nextry.key`) secure and never commit it to version control
- Add `.tauri/nextry.key` to your `.gitignore`
- Store the key in a secure location and share it only with authorized team members

## Project Structure
```
nextry-ui-admin/
├── src/                    # Angular source files
├── src-tauri/             # Tauri backend
├── public/                # Static assets
└── .tauri/               # Tauri configuration and keys
```
