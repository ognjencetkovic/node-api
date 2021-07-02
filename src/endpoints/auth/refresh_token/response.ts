export const responseSchema = {
    type: `object`,
    properties: {
        body: {
            type: `object`,
            properties: {
                success: {
                    type: `boolean`,
                },
                response: {
                    type: `object`,
                    properties: {
                        access_token: {
                            type: `string`,
                        },
                        refresh_token: {
                            type: `string`,
                            format: `email`,
                        },
                    },
                    required: [`access_token`, `refresh_token`],
                },
            },
            required: [`success`],
        },
    },
};
