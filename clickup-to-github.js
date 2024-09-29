#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');

// ASCII banner
function printBanner() {
    console.log(`
   _____ _ _      _                  _______       _____ _ _   _           _     
  / ____| (_)    | |                |__   __|     / ____(_) | | |         | |    
 | |    | |_  ___| | ___   _ _ __      | | ___   | |  __ _| |_| |__  _   _| |__  
 | |    | | |/ __| |/ / | | | '_ \\     | |/ _ \\  | | |_ | | __| '_ \\| | | | '_ \\ 
 | |____| | | (__|   <| |_| | |_) |    | | (_) | | |__| | | |_| | | | |_| | |_) |
  \\_____|_|_|\\___|_|\\_\\\\__,_| .__/     |_|\\___/   \\_____|_|\\__|_| |_|\\\\__,_|_.__/ 
                            | |                                                  
                            |_|                                                  
`);
}

// Fetch tasks from ClickUp
async function fetchClickUpTasks(clickUpToken, listId) {
    try {
        const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'GET',
            headers: {
                Authorization: clickUpToken,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.tasks;
    } catch (error) {
        console.error('Error fetching ClickUp tasks:', error.message);
        process.exit(1);
    }
}

// Create issues in GitHub
async function createGitHubIssue(githubToken, owner, repo, title, body) {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/issues`,
            {
                method: 'POST',
                headers: {
                    Authorization: `token ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating GitHub issue:', error.message);
        process.exit(1);
    }
}

// Function to fetch all issues from GitHub
async function fetchGitHubIssues(githubToken, owner, repo) {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/issues?state=all`,
            {
                method: 'GET',
                headers: {
                    Authorization: `token ${githubToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub issues:', error.message);
        process.exit(1);
    }
}

// Function to delete a single GitHub issue
// async function deleteGitHubIssue(githubToken, owner, repo, issueNumber) {
//     try {
//         const response = await fetch(
//             `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
//             {
//                 method: 'DELETE',
//                 headers: {
//                     Authorization: `token ${githubToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         console.log(`Deleted GitHub issue #${issueNumber}`);
//     } catch (error) {
//         console.error('Error deleting GitHub issue:', error.message);
//     }
// }

// Function to mass delete all issues
// async function massDeleteGitHubIssues(githubToken, owner, repo) {
//     const issues = await fetchGitHubIssues(githubToken, owner, repo);

//     for (const issue of issues) {
//         if (issue.state !== 'closed') { // Only delete open issues
//             await deleteGitHubIssue(githubToken, owner, repo, issue.number);
//         }
//     }
// }

// Main function to run the command
async function main() {
    printBanner();

    try {
        const prompt = inquirer.createPromptModule(); // Create a new prompt module
        const answers = await prompt([
            {
                type: 'input',
                name: 'clickupToken',
                message: 'Enter your ClickUp API token:',
                validate: (input) => (input ? true : 'ClickUp API token is required'),
            },
            {
                type: 'input',
                name: 'listId',
                message: 'Enter your ClickUp list ID:',
                validate: (input) => (input ? true : 'ClickUp list ID is required'),
            },
            {
                type: 'input',
                name: 'githubToken',
                message: 'Enter your GitHub Personal Access Token:',
                validate: (input) => (input ? true : 'GitHub Personal Access Token is required'),
            },
            {
                type: 'input',
                name: 'owner',
                message: 'Enter the GitHub repository owner:',
                validate: (input) => (input ? true : 'GitHub repository owner is required'),
            },
            {
                type: 'input',
                name: 'repo',
                message: 'Enter the GitHub repository name:',
                validate: (input) => (input ? true : 'GitHub repository name is required'),
            },
        ]);

        // Store the parameters for later use
        const { clickupToken, listId, githubToken, owner, repo } = answers;

        // List of commands for the user to choose from
        const command = inquirer.createPromptModule();
        const commandPrompt = await command([
            {
                type: 'list',
                name: 'command',
                message: 'Select a command to execute:',
                choices: [
                    { name: 'Sync tasks from ClickUp to GitHub as issues', value: 'sync' },
                    // { name: 'Mass delete all issues from GitHub', value: 'delete' },
                    { name: 'Exit', value: 'exit' },
                ],
            },
        ]);

        if (commandPrompt.command === 'sync') {
            const tasks = await fetchClickUpTasks(clickupToken, listId);
            tasks.reverse();
            for (const task of tasks) {
                await createGitHubIssue(githubToken, owner, repo, task.name, task.text_content || task.description || '');
                console.log(`Created GitHub issue: ${task.name}`);
            }
            // } else if (commandPrompt.command === 'delete') {
            //     await massDeleteGitHubIssues(githubToken, owner, repo);
        } else {
            console.log('Exiting the program.');
            process.exit(0);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Command-line setup with commander
program
    .name('clickup-to-github')
    .description('A CLI tool to create GitHub issues from ClickUp tasks or delete GitHub issues')
    .version('1.0.0');

program
    .command('start')
    .description('Start the ClickUp to GitHub sync tool')
    .action(() => {
        main();
    });

program.parse(process.argv);
