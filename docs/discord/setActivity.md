---
title: "Setting the Discord Bot's Activity"
description: "A guide on how to dynamically update the Discord bot's activity status using TypeScript."
---

## Overview

This guide demonstrates how to set and update a Discord bot's activity status dynamically. It includes two main components: `events/ready.ts`, which is the main script for setting the activity, and `utils/discord.ts`, which contains a utility function for determining the activity type.

### `events/ready.ts`

The `ready.ts` file is responsible for setting and updating the bot's activity status every 5 seconds. It randomly selects an activity from a predefined list and sets the bot's activity accordingly.

```typescript
setInterval(() => {
  const random =
    config.Activities[Math.floor(Math.random() * config.Activities.length)];

  if (!random || typeof random.type !== "string") {
    return;
  }

  const activityType: ActivityType | undefined = getActivityType(random.type);

  if (activityType !== undefined) {
    const activityName: string = random.name || "";

    client.user.setActivity({ type: activityType, name: activityName });
  }
}, 5000);
```

### `utils/discord.ts`

The `utils/discord.ts` file contains the `getActivityType` function. This function maps a string to its corresponding `ActivityType` enum value. Supported types are `Playing`, `Listening`, `Watching`, `Competing`, and `Custom`.

```ts
export function getActivityType(type: string): ActivityType | undefined {
  switch (type.toLowerCase()) {
    case "playing":
      return ActivityType.Playing;
    case "listening":
      return ActivityType.Listening;
    case "watching":
      return ActivityType.Watching;
    case "competing":
      return ActivityType.Competing;
    case "custom":
      return ActivityType.Custom;
    default:
      return undefined;
  }
}
```

### Configuration

1. **Activity List**: Define a list of activities in your `config` object. Each activity should have a `type` and a `name`.

2. **Setting Up**: Ensure `events/ready.ts` and `utils/discord.ts` are properly included in your bot's project.

3. **Running the Bot**: Once the bot is running, it will automatically update its activity status every 5 seconds based on the provided list.
