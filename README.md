# BioFold

BioFold (also known as BioManifold) is a full-stack web application designed for biological data dimensionality reduction and manifold learning. It provides an intuitive interface to upload datasets, preprocess data, and perform advanced dimensionality reduction techniques, visualizing the results in an interactive manner.

## Features

- **Data Upload & Preprocessing:** Upload biological datasets (e.g., CSV format) for analysis.
- **Dimensionality Reduction:** Seamlessly run algorithms like PCA, t-SNE, and UMAP to identify patterns and structures in high-dimensional biological data.
- **Interactive Visualizations:** High-quality, interactive 2D and 3D plots powered by Plotly.js.
- **Modern UI:** Built with React and Tailwind CSS for a sleek, responsive, and user-friendly experience.

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Plotly.js (react-plotly.js)** - Interactive data visualization
- **Axios** - API communication

### Backend
- **Flask** - Python web framework
- **scikit-learn & umap-learn** - Machine learning and dimensionality reduction algorithms
- **Pandas & NumPy** - Data manipulation and numerical operations
- **Flask-CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.8+

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend will start running at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be accessible at `http://localhost:3000`.

## Usage

1. Open the application in your browser (`http://localhost:3000`).
2. Upload your biological dataset using the file upload interface.
3. Select the desired algorithm (PCA, t-SNE, or UMAP).
4. Explore the generated visualizations in the interactive viewer.

## License
MIT License