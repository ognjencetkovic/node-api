export const requestSchema = {
    type: `object`,
    properties: {
        body: {
            type: `object`,
            properties: {
                email: {
                    type: `string`,
                    format: `email`,
                },
                password: {
                    type: `string`,
                },
            },
            required: [`email`, `password`],
        },
        headers: {
            type: `object`,
            properties: {
                session_id: {
                    type: `string`,
                },
            },
        },
    },
};
