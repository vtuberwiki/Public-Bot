type WebRequestType = "GET" | "POST" | "PUT" | "DELETE";

export default interface WebRequest {
    method: WebRequestType;
    requiredParameters: string[];
}