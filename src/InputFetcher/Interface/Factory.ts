import Service from "../Interface/Service.js";
interface Factory {
    getService(
        type: "url" | "file" | "array",
        source: string | Array<string>
    ): Service;
}

export default Factory;
