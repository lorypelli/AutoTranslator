import { ApplicationCommandType } from 'discord-api-types/v10';
import { ANYWHERE, embedResponse } from '../../discord/index.js';
import type { Command } from '../../types/index.js';
import { GITHUB_URL } from '../../utils/index.js';

export const GITHUB_COMMAND: Command = {
    data: {
        ...ANYWHERE,
        type: ApplicationCommandType.ChatInput,
        name: 'github',
        description: 'Get the link to the source code',
    },
    run(interaction) {
        return embedResponse(interaction, `[Source code](${GITHUB_URL})`);
    },
};
