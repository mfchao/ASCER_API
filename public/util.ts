type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea" | "json";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
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
    fields: { },
  },
  {
    name: "Start Session",
    endpoint: "/api/session/start",
    method: "POST",
    fields: { token: "input"},
  },
  {
    name: "End Session (empty for done)",
    endpoint: "/api/session/end",
    method: "POST",
    fields: { email: "input" },
  },
  {
    name: "Get Question",
    endpoint: "/api/users/category",
    method: "GET",
    fields: {},
  },
  {
    name: "Get Descriptions",
    endpoint: "/api/users/descriptions",
    method: "GET",
    fields: {},
  },
  {
    name: "Get Users",
    endpoint: "/api/users",
    method: "GET",
    fields: {},
  },
  {
    name: "Delete All Users",
    endpoint: "/api/users",
    method: "DELETE",
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
    name: "Get Images",
    endpoint: "/api/images/:image",
    method: "GET",
    fields: {image: "input"},
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
    endpoint: "/api/dataset/users/:token",
    method: "GET",
    fields: {token: "input"},
  },
  {
    name: "Get Ratings for Image",
    endpoint: "/api/dataset/rating",
    method: "GET",
    fields: {image: "input"},
  },
  {
    name: "Delete Dataset",
    endpoint: "/api/dataset",
    method: "DELETE",
    fields: {},
  },
];


// Do not edit below here.
function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
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
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
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

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
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

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
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
    const type = key.split(".").reduce((obj, key) => obj[key], op?.fields as any);
    if (type === "json") {
      reqData[key] = JSON.parse(val as string);
    }
  }

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
