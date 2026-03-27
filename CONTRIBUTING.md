# Contributing to KL Material Hub

Thank you for your interest in contributing to the KL Material Study Hub! Our goal is to provide a comprehensive, free, and accessible resource for all B.Tech CSE students.

## How to Contribute

There are several ways you can help improve the study hub:

### 1. Adding Study Materials (PDFs)

Do you have helpful notes, previous year question (PYQ) papers, or reference PDFs? You can add them!

1. **Fork the repository** on GitHub.
2. Place your `.pdf` file in the correct subfolder under `materials/`.
   - For example: `materials/BEEC/your_file_name.pdf`
   - **Important:** Use descriptive file names without spaces, replacing spaces with underscores (e.g., `Unit_1_Notes_BEEC.pdf`).
3. **Commit your changes**: `git commit -m "Add BEEC Unit 1 Notes"`
4. **Push to your fork** and submit a **Pull Request (PR)**.

*Note: Since PDFs can be large, we track them using Git LFS (Large File Storage). If you are adding many large files, ensure you have Git LFS installed.*

### 2. Reporting Bugs or Requesting Features

If you encounter an issue or have an idea for a new feature (like a new chatbot response or a UI improvement), please open an issue in the repository. Provide as much detail as possible to help us understand and resolve it.

### 3. Code Contributions

We welcome improvements to the codebase!

1. **Fork the project.**
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes in the HTML, CSS, or JS files.
4. **Testing is crucial!** Please test your changes, specifically on smaller screens.
   - Use your browser's Developer Tools to test the UI at **mobile viewports (375px – 430px width)** before submitting.
5. Submit a Pull Request describing your changes.

## Running the Project Locally

You don't need a complex build setup to run this project. Since it relies on vanilla HTML/CSS/JS, you can serve it locally using any simple HTTP server.

For example, using Python:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

*Note: Some features (like fetching the materials list) use the GitHub API, which has rate limits for unauthenticated requests. You might need to add a GitHub Personal Access Token (`GITHUB_TOKEN`) to `github-materials.js` if you are doing extensive local testing.*

Thank you for your contributions!
