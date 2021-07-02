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
                        status: {
                            type: `string`,
                        },
                    },
                    required: [`status`],
                },
            },
            required: [`success`],
        },
    },
};
