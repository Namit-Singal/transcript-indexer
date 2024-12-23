# 📊 ROIC Transcript Indexer

A Chrome extension that automatically indexes and downloads earnings call transcripts from ROIC.ai. It systematically navigates through quarterly transcripts, saving them as structured JSON files with speaker information, content, and metadata. 🚀

## ✨ Features

- 🤖 **Automated Indexing**: Automatically traverses through quarterly transcripts on ROIC.ai
- 📝 **Structured Data**: Saves transcripts as JSON files with:
  - 🎤 Speaker information
  - 📜 Transcript content
  - 🏢 Company metadata
  - ⏰ Timestamps
- 📁 **Organized Storage**: Files are saved in dedicated folders with consistent naming (YYYY_Q#.json)
- 🎮 **User Controls**: Simple popup interface to start/stop indexing
- 📈 **Progress Tracking**: Visual feedback on indexing status
- 🛡️ **Error Handling**: Graceful handling of missing transcripts and navigation errors

## 🔧 Installation

1. 📥 Clone this repository or download the source code
2. 🌐 Open Chrome and navigate to `chrome://extensions/`
3. 👨‍💻 Enable "Developer mode" in the top right
4. 📦 Click "Load unpacked" and select the `transcript-indexer` directory

## 📖 Usage

1. 🏃‍♂️ Navigate to any ROIC.ai transcript page
2. 🖱️ Click the extension icon in your Chrome toolbar
3. ▶️ Click "Start Indexing" to begin the automated process
4. 🔄 The extension will:
   - Download the current page's transcript
   - Automatically navigate to the previous quarter
   - Continue until completion or manual stop
5. ⏹️ Use the "Stop Indexing" button to halt the process at any time

## 📋 Output Format

Each transcript is saved as a JSON file with the following structure:

```json
{
  "url": "https://www.roic.ai/...",
  "timestamp": "2024-03-21T12:00:00.000Z",
  "metadata": {
    "company": "Company Name",
    "date": "Transcript Date",
    "title": "Earnings Call Title"
  },
  "transcript": [
    {
      "speaker": "Speaker Name",
      "content": "Speaker's message"
    }
    // ... additional entries
  ],
  "hasTranscript": true
}
```

## 🔐 Permissions

The extension requires the following permissions:
- 🔍 `activeTab`: To access the current tab's content
- 📜 `scripting`: To inject content scripts
- ⬇️ `downloads`: To save transcript files
- 💾 `storage`: To maintain indexing state
- 🌐 `host_permissions`: Limited to "https://www.roic.ai/*"

## 👨‍💻 Development

The extension consists of the following key components:
- 🖥️ `popup.html/js`: User interface and control logic
- 🕷️ `content.js`: Page scraping and navigation logic
- 🔄 `background.js`: File download handling
- ⚙️ `manifest.json`: Extension configuration

## 📜 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

The GNU GPL is a free, copyleft license that ensures the software remains free and open source. Under this license, you are free to:

- 🔄 Use, study, and modify the software
- 📤 Share the original or modified software
- 🏢 Use the software for commercial purposes

With the following conditions:
- 📝 You must include the original copyright and license notices
- 📖 You must make the source code available when distributing the software
- 🔄 Any modifications must be released under the same license
- 📋 Changes made to the code must be documented

For more details, visit: https://www.gnu.org/licenses/gpl-3.0.html

## ⚠️ Disclaimer

This tool is for educational and research purposes only. Ensure compliance with ROIC.ai's terms of service when using this extension. 🤝
