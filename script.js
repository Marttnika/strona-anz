const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        context.res = {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: { error: "Brak wymaganych danych." }
        };
        return;
    }

    // Dane dostępowe do Storage Account
    const account = "anzformstorage";
    const accountKey = "MSleWhS65v4S/AIJdN011/O8tEWMRsQGeZH3PuR7KUj/0m5Y8dHPikaaHW4TGuzpoSCinO3sHBTq+AStfMMYQQ==";
    const tableName = "FormSubmissions";

    const credential = new AzureNamedKeyCredential(account, accountKey);
    const client = new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        credential
    );

    const entity = {
        partitionKey: "Kontakt",
        rowKey: Date.now().toString(),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    try {
        await client.createEntity(entity);

        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: { message: "Dane zostały zapisane pomyślnie." }
        };
    } catch (error) {
        context.log("Błąd zapisu:", error);
        context.res = {
            status: 500,
            headers: { "Content-Type": "application/json" },
            body: { error: "Błąd zapisu danych do tabeli." }
        };
    }
};
