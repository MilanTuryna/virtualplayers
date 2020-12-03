class Bot {
    constructor(username, customDescription, minecraftVersion, server, password = null) {
        this.username = username;
        this.customDescription = customDescription;
        this.minecraftVersion = minecraftVersion;
        this.server = server;
        this.password = password;
        this.enabled = false;
    }

    toJSON() {
        return JSON.stringify({
            username: this.username,
            customDescription: this.customDescription,
            minecraftVersion: this.minecraftVersion,
            server: this.server,
            password: this.password,
            enabled: this.enabled
        });
    }

    setEnabled(value) {
        this.enabled = value;
    }
}
module.exports = Bot;