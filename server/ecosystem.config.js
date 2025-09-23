module.exports = {
    apps: [
        {
            name: "shabu",
            script: "npm",
            args: "run production",
            env: {
                BUILD_MODE: "dev"
            },
            env_production: {
                BUILD_MODE: "production"
            }
        }
    ]
};
