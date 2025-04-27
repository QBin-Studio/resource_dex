import configJson from "../../../../.config/resource_dex.config.json" with {
    type: "json",
};

export type TResounceDexConfig = {
    resource_dex_config: string;
};

let resourceDexConfig: TResounceDexConfig;

export function loadResounceDexConfig() {
    resourceDexConfig = {
        resource_dex_config: configJson.resource_base,
    };
}

export function getResourceDexConfig() {
    if (!resourceDexConfig) {
        throw new Error(
            "resource dex config is not loaded correctly. make sure file is added;",
        );
    }
    return resourceDexConfig;
}
