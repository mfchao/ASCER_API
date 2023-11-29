"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const operations = [
    // {
    //   name: "Get Current Session",
    //   endpoint: "/api/session",
    //   method: "GET",
    //   fields: { token: "input" },
    // },
    // {
    //   name: "Get All Sessions",
    //   endpoint: "/api/session/sessions",
    //   method: "GET",
    //   fields: {},
    // },
    {
        name: "Get Current Token",
        endpoint: "/api/session",
        method: "GET",
        fields: {},
    },
    {
        name: "Start Session",
        endpoint: "/api/session/start",
        method: "POST",
        fields: { token: "input", category: "input" },
    },
    {
        name: "End Session (empty for done)",
        endpoint: "/api/session/end",
        method: "POST",
        fields: { email: "input" },
    },
    {
        name: "Create User",
        endpoint: "/api/users",
        method: "POST",
        fields: { category: "input", token: "input" },
    },
    {
        name: "Get Users",
        endpoint: "/api/users",
        method: "GET",
        fields: {},
    },
    {
        name: "Create Image",
        endpoint: "/api/images",
        method: "POST",
        fields: { file: "input", link: "input" },
    },
    {
        name: "Get Images",
        endpoint: "/api/images",
        method: "GET",
        fields: {},
    },
    {
        name: "Delete Image",
        endpoint: "/api/images/file",
        method: "DELETE",
        fields: { file: "input" },
    },
    {
        name: "Delete All Images",
        endpoint: "/api/images",
        method: "DELETE",
        fields: {},
    },
    {
        name: "Create Data Entry",
        endpoint: "/api/dataset",
        method: "POST",
        fields: { image: "input", rating: "input" },
    },
    {
        name: "Update Data Entry",
        endpoint: "/api/dataset",
        method: "PATCH",
        fields: { image: "input", update: { rating: "input" } },
    },
    {
        name: "Get Dataset",
        endpoint: "/api/dataset",
        method: "GET",
        fields: {},
    },
    {
        name: "Get Dataset by Token",
        endpoint: "/api/dataset/token",
        method: "GET",
        fields: { token: "input" },
    },
    {
        name: "Get Ratings for Image",
        endpoint: "/api/dataset/rating",
        method: "GET",
        fields: { image: "input" },
    },
];
// Do not edit below here.
function updateResponse(code, response) {
    document.querySelector("#status-code").innerHTML = code;
    document.querySelector("#response-text").innerHTML = response;
}
function request(method, endpoint, params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (method === "GET" && params) {
                endpoint += "?" + new URLSearchParams(params).toString();
                params = undefined;
            }
            const res = fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "same-origin",
                body: params ? JSON.stringify(params) : undefined,
            });
            return {
                $statusCode: (yield res).status,
                $response: yield (yield res).json(),
            };
        }
        catch (e) {
            console.log(e);
            return {
                $statusCode: "???",
                $response: { error: "Something went wrong, check your console log.", details: e },
            };
        }
    });
}
function fieldsToHtml(fields, indent = 0, prefix = "") {
    return Object.entries(fields)
        .map(([name, tag]) => {
        const htmlTag = tag === "json" ? "textarea" : tag;
        return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${htmlTag} name="${prefix}${name}"></${htmlTag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
        .join("");
}
function getHtmlOperations() {
    return operations.map((operation) => {
        return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
    });
}
function prefixedRecordIntoObject(record) {
    const obj = {}; // eslint-disable-line
    for (const [key, value] of Object.entries(record)) {
        if (value === undefined || value === null || value === "") {
            continue;
        }
        const keys = key.split(".");
        const lastKey = keys.pop();
        let currentObj = obj;
        for (const key of keys) {
            if (!currentObj[key]) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }
        currentObj[lastKey] = value;
    }
    return obj;
}
function submitEventHandler(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const form = e.target;
        const _a = Object.fromEntries(new FormData(form)), { $method, $endpoint } = _a, reqData = __rest(_a, ["$method", "$endpoint"]);
        // Replace :param with the actual value.
        const endpoint = $endpoint.replace(/:(\w+)/g, (_, key) => {
            const param = reqData[key];
            delete reqData[key];
            return param;
        });
        const op = operations.find((op) => op.endpoint === $endpoint && op.method === $method);
        const pairs = Object.entries(reqData);
        for (const [key, val] of pairs) {
            if (val === "") {
                delete reqData[key];
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const type = key.split(".").reduce((obj, key) => obj[key], op === null || op === void 0 ? void 0 : op.fields);
            if (type === "json") {
                reqData[key] = JSON.parse(val);
            }
        }
        const data = prefixedRecordIntoObject(reqData);
        updateResponse("", "Loading...");
        const response = yield request($method, endpoint, Object.keys(data).length > 0 ? data : undefined);
        updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
    });
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#operations-list").innerHTML = getHtmlOperations().join("");
    document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
//# sourceMappingURL=util.js.map