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
                        user_id: {
                            type: `string`,
                        },
                        email: {
                            type: `string`,
                            format: `email`,
                        },
                    },
                    required: [`user_id`, `email`],
                },
            },
            required: [`success`],
        },
    },
};
