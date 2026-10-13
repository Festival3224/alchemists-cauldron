# Alchemist's Cauldron

An interactive potion-brewing game developed with TypeScript as part of the [RS School](https://rs.school/) Front-end Short Track.

## About the Game

Alchemist's Cauldron is a browser-based game where players combine magical ingredients to brew potions.

Each ingredient affects three parameters:

- **Temperature**
- **Density**
- **Magic Power**

The goal is to select the right combination of ingredients so that all three parameters fall within the target ranges of the current recipe.

Players must manage limited ingredient stocks, brew potions, earn points, and survive before running out of time or lives.

## Project Stages

The project is developed incrementally across four stages:

### Precondition 1 - Project Setup

Set up the repository, development environment, TypeScript configuration, code quality tools, and project structure.

### Level 1 - Basic Game

Implement the core gameplay, including:

- Ingredient shelf and cauldron
- Parameter calculations and visual bars
- Recipes and brewing validation
- Timer, lives, and game-over conditions
- Pause functionality
- Top-10 leaderboard

### Level 2 - Extended Game

Add difficulty selection (Easy, Medium, Hard), automatic game saving, and the ability to continue a previous game.

### Level 3 - Full Game

Extend gameplay with drag and drop, ingredient tooltips, chemical reactions, Pour Out functionality, keyboard shortcuts, and visual feedback.

## Tech Stack

- TypeScript
- HTML5
- CSS3
- Vite

## Getting Started

**Prerequisites:** Node.js and npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

The application separates game data, business logic, state management, browser storage, UI rendering, and styles.

The folder structure will be expanded as the game features are implemented.

## Task Documentation

[Alchemist's Cauldron - RS School Assignment](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)
