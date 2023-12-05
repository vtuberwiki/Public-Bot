# Vtuber Wiki Discord Bot

## Overview

The Vtuber Wiki Public Discord Bot is an advanced tool designed to facilitate seamless access to information from the [Vtuber Wiki](https://vtubers.wiki). Leveraging the capabilities of the [Node.js Vtuber Wiki SDK](https://vtubers.wiki/sdk/node), this bot streamlines the retrieval of data from the extensive Vtuber Wiki database, offering users a rich and comprehensive experience.

## Installation

### Prerequisites

Ensure you have the following prerequisites in place before setting up and running the Vtuber Wiki Discord Bot:

- [Node.js](https://nodejs.org/en/) (Version 20.10.0 or higher)
- [Git](https://git-scm.com/)
- [Discord Bot Token](https://discord.com/developers/applications)

### Setup Process

1. Clone the repository:

```bash
git clone https://github.com/vtuberwiki/Public-Bot.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and include the following variables:

```env
emailPassword = YOUR_EMAIL_PASSWORD
token = YOUR_DISCORD_BOT_TOKEN
environment = YOUR_ENVIRONMENT_MODE (development or production)
```

4. Run the bot:

```bash
npm run dev # For production, use npm run start
```

## Documentation

Comprehensive documentation for the Vtuber Wiki Discord Bot is available in the [`/docs`](/docs) directory. We recommend consulting this resource for detailed information on bot functionalities, usage guidelines, and customization options.

## Contribution Guidelines

If you are interested in contributing to this project, please take the time to review the [Contributing Guidelines](/.github/CONTRIBUTING.md) before making any contributions. Your collaboration is highly valued, and these guidelines will help streamline the process.

## License

This project is licensed under the [GPL-3.0](/LICENSE) license.

## Contact Information

For further inquiries or assistance, we encourage you to join our [Discord Server](https://discord.gg/WqAQYX3jw7). Feel free to engage with the community and ask questions in the `#🔨-faq` channel. We appreciate your involvement and welcome any feedback or suggestions you may have.
