# OCR My PDF

A modern web application that extracts text from PDF files using AI-powered OCR technology. Built with React, Express, DaisyUI, and Tesseract.js.

## Features

- 📄 **PDF Upload**: Drag-and-drop or browse to upload PDF files
- 🤖 **OCR Processing**: AI-powered text extraction using Tesseract.js
- 📊 **Text Statistics**: View word count, line count, and character count
- 📋 **Copy to Clipboard**: One-click copy functionality
- 💾 **Download as TXT**: Export extracted text as a text file
- 🎨 **Beautiful UI**: Vibrant professional colors with smooth animations
- ⚡ **Fast & Responsive**: Built with modern web technologies

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS + DaisyUI
- Framer Motion for animations
- React Dropzone for file uploads
- Axios for HTTP requests

### Backend
- Express.js
- Tesseract.js for OCR
- pdf-parse for PDF processing
- Multer for file uploads
- CORS enabled

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone or navigate to the project directory**
```bash
cd ocr-my-pdf
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Start the Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Drag and drop a PDF file or click "Browse Files" to select one
3. Wait for the OCR processing to complete
4. View the extracted text, copy it, or download it as a TXT file
5. Click the X button to upload another file

## Project Structure

```
ocr-my-pdf/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── FileUpload.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── OCRResults.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json
│
└── server/                # Express backend
    ├── controllers/       # Route controllers
    │   └── ocrController.js
    ├── middleware/        # Custom middleware
    │   └── upload.js
    ├── routes/           # API routes
    │   └── ocrRoutes.js
    ├── uploads/          # Temporary file storage
    ├── server.js         # Main server file
    └── package.json
```

## API Endpoints

### POST `/api/ocr/upload`
Upload and process a PDF file

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: PDF file with key `pdf`

**Response:**
```json
{
  "success": true,
  "text": "Extracted text content...",
  "fileName": "document.pdf",
  "message": "OCR processing completed successfully"
}
```

### GET `/api/health`
Check server status

**Response:**
```json
{
  "status": "OK",
  "message": "OCR Server is running"
}
```

## Configuration

### Server Configuration
Edit `server/.env` to change server settings:
```env
PORT=5000
NODE_ENV=development
```

### File Upload Limits
Maximum file size: 10MB (configurable in `server/middleware/upload.js`)

## License

MIT

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine
- [DaisyUI](https://daisyui.com/) - Tailwind CSS components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
