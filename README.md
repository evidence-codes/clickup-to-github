# ClickUp to GitHub

## Overview

The **ClickUp to GitHub CLI Tool** is a command-line interface designed to streamline task management by syncing tasks from ClickUp to GitHub. This tool allows users to easily create GitHub issues based on their ClickUp tasks, enabling better organization and tracking of work.

## Features

- **Sync Tasks**: Fetches tasks from a specified ClickUp list and creates corresponding issues in a designated GitHub repository.
- **User-Friendly Interface**: Utilizes `inquirer` for interactive command-line prompts, guiding users through the necessary input for API tokens and repository details.
- **Error Handling**: Provides informative error messages if there are issues with user inputs.
- **ASCII Banner**: Displays a visually appealing banner when the tool is launched, enhancing the user experience.

## Installation

1. **Download the CLI Tool**:

   - You can download the latest release from the [GitHub Releases page](https://github.com/evidence-codes/clickup-to-github/releases).

2. **Make the Tool Executable** (Linux and macOS):
   - After downloading, navigate to the directory where the tool is located.
   - Run the following command to make the script executable:
     ```bash
     chmod +x clickup-to-github-linux
     chmod +x clickup-to-github-macos
     ```

## Running the Tool

- **Linux**:
  ```bash
  ./clickup-to-github-linux start
  ```
- **macOS**:
  ```bash
  ./clickup-to-github-macos start
  ```
- **Windows**:
  - Open a terminal (Command Prompt or PowerShell) and navigate to the directory where the executable is located.
  - Run the tool using the following command:
  ```bash
  .\clickup-to-github-win.exe start
  ```

## Usage

1. **API Tokens**: You will need your ClickUp API token and GitHub Personal Access Token.
2. **ClickUp List ID**: Provide the ClickUp list ID for the list of tasks.
3. **Repository Details**: Provide the GitHub repository owner and name where issues will be created.
4. **Task Sync:** Select the command to sync tasks from ClickUp to GitHub, and the tool will handle the rest!

## Commands

- **Start Sync**: Initiates the process of syncing ClickUp tasks to GitHub issues.
- **Exit**: Exits the tool gracefully.

## Contributions

Contributions to the project are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
