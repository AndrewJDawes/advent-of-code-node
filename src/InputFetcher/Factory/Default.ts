import Factory from "../Interface/Factory.js";
import Service from "../Interface/Service.js";
import URL from "../Service/URL.js";
import FilePath from "../Service/FilePath.js";
import StringArray from "../Service/StringArray.js";
class Default implements Factory {
    getService(type: string, source: string | Array<string>): Service {
        switch (type) {
            case "url":
                if (!(typeof source === "string")) {
                    throw new Error(
                        "Default factory: URL source must be a string"
                    );
                }
                return new URL(source);
            case "file":
                if (!(typeof source === "string")) {
                    throw new Error(
                        "Default factory: File source must be a string"
                    );
                }
                return new FilePath(source);
            case "array":
                if (!(source instanceof Array)) {
                    throw new Error(
                        "Default factory: Array source must be an array"
                    );
                }
                return new StringArray(source);
            default:
                throw new Error("Default factory: unknown type");
        }
    }
}

export default Default;
