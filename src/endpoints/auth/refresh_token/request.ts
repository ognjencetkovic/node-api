export const requestSchema = {
    type: `object`,
    properties: {
        body: {
            type: `object`,
            properties: {
                refresh_token: {
                    type: `string`,
                },
            },
            required: [`refresh_token`],
        },
    },
};
