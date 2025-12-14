# 激活码校验集成指南

本文档提供激活码校验 API 的集成说明，帮助其他项目快速接入激活码验证功能。

## 快速开始

### API 信息

| 项目 | 值 |
|------|-----|
| 接口地址 | `POST https://api.qianxue.online/api/activation/validate` |
| 认证方式 | 无需认证 |
| Content-Type | `application/json` |

### 请求格式

```json
{
  "code": "YOUR-ACTIVATION-CODE"
}
```

### 响应格式

```json
{
  "isValid": true,
  "message": "Activation code is valid",
  "expiresAt": "2025-12-21T12:00:00Z",
  "validationCount": 1,
  "remainingValidations": 2
}
```

---

## 响应状态说明

| isValid | HTTP 状态码 | 说明 |
|---------|------------|------|
| `true` | 200 | 激活码有效 |
| `false` | 400 | 激活码已过期或验证次数超限 |
| `false` | 404 | 激活码不存在 |

### 响应字段

| 字段 | 类型 | 说明 |
|------|------|------|
| isValid | boolean | 激活码是否有效 |
| message | string | 状态描述信息 |
| expiresAt | datetime | 过期时间（ISO 8601 格式） |
| validationCount | int | 已验证次数 |
| remainingValidations | int | 剩余可验证次数 |

---

## 业务规则

1. **首次验证**：激活码首次验证时自动激活，有效期 7 天
2. **验证次数限制**：每个激活码最多验证 3 次，超过后失效
3. **速率限制**：每分钟 3 次请求，每小时 10 次请求

---

## 集成示例

### cURL

```bash
curl -X POST https://api.qianxue.online/api/activation/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"YOUR-CODE-HERE"}'
```

### Python

```python
import requests

def validate_activation_code(code: str) -> dict:
    """
    校验激活码
    
    Args:
        code: 激活码字符串
        
    Returns:
        dict: 包含 isValid, message, expiresAt 等字段
    """
    response = requests.post(
        "https://api.qianxue.online/api/activation/validate",
        json={"code": code},
        timeout=10
    )
    return response.json()

# 使用示例
result = validate_activation_code("YOUR-CODE-HERE")
if result.get("isValid"):
    print(f"激活码有效，过期时间: {result['expiresAt']}")
else:
    print(f"激活码无效: {result['message']}")
```

### JavaScript / TypeScript

```typescript
interface ValidateResponse {
  isValid: boolean;
  message: string;
  expiresAt: string | null;
  validationCount: number;
  remainingValidations: number;
}

async function validateActivationCode(code: string): Promise<ValidateResponse> {
  const response = await fetch(
    "https://api.qianxue.online/api/activation/validate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }
  );
  return response.json();
}

// 使用示例
const result = await validateActivationCode("YOUR-CODE-HERE");
if (result.isValid) {
  console.log(`激活码有效，过期时间: ${result.expiresAt}`);
} else {
  console.log(`激活码无效: ${result.message}`);
}
```

### Java

```java
import java.net.http.*;
import java.net.URI;

public class ActivationCodeValidator {
    private static final String API_URL = "https://api.qianxue.online/api/activation/validate";
    
    public static String validate(String code) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(API_URL))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                String.format("{\"code\":\"%s\"}", code)
            ))
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
```

### C#

```csharp
using System.Net.Http.Json;

public class ActivationCodeValidator
{
    private static readonly HttpClient _client = new();
    private const string ApiUrl = "https://api.qianxue.online/api/activation/validate";

    public record ValidateRequest(string Code);
    public record ValidateResponse(
        bool IsValid, 
        string Message, 
        DateTime? ExpiresAt,
        int? ValidationCount,
        int? RemainingValidations
    );

    public static async Task<ValidateResponse?> ValidateAsync(string code)
    {
        var response = await _client.PostAsJsonAsync(ApiUrl, new ValidateRequest(code));
        return await response.Content.ReadFromJsonAsync<ValidateResponse>();
    }
}

// 使用示例
var result = await ActivationCodeValidator.ValidateAsync("YOUR-CODE-HERE");
if (result?.IsValid == true)
{
    Console.WriteLine($"激活码有效，过期时间: {result.ExpiresAt}");
}
```

### Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

type ValidateRequest struct {
    Code string `json:"code"`
}

type ValidateResponse struct {
    IsValid              bool    `json:"isValid"`
    Message              string  `json:"message"`
    ExpiresAt            *string `json:"expiresAt"`
    ValidationCount      *int    `json:"validationCount"`
    RemainingValidations *int    `json:"remainingValidations"`
}

func ValidateActivationCode(code string) (*ValidateResponse, error) {
    reqBody, _ := json.Marshal(ValidateRequest{Code: code})
    
    resp, err := http.Post(
        "https://api.qianxue.online/api/activation/validate",
        "application/json",
        bytes.NewBuffer(reqBody),
    )
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var result ValidateResponse
    json.NewDecoder(resp.Body).Decode(&result)
    return &result, nil
}
```

---

## 错误处理建议

```python
# Python 示例 - 完整错误处理
import requests
from requests.exceptions import RequestException

def validate_with_retry(code: str, max_retries: int = 3) -> dict:
    for attempt in range(max_retries):
        try:
            response = requests.post(
                "https://api.qianxue.online/api/activation/validate",
                json={"code": code},
                timeout=10
            )
            
            # 处理速率限制
            if response.status_code == 429:
                time.sleep(60)  # 等待1分钟后重试
                continue
                
            return response.json()
            
        except RequestException as e:
            if attempt == max_retries - 1:
                return {"isValid": False, "message": f"网络错误: {str(e)}"}
            time.sleep(2 ** attempt)  # 指数退避
    
    return {"isValid": False, "message": "验证失败，请稍后重试"}
```

---

## 常见问题

### Q: 激活码验证失败怎么办？

检查返回的 `message` 字段：
- `"Activation code not found"` - 激活码不存在，检查输入是否正确
- `"Activation code has expired"` - 激活码已过期，需要新的激活码
- `"Activation code has been invalidated..."` - 验证次数超限，激活码已失效

### Q: 如何处理速率限制？

收到 HTTP 429 响应时，等待 60 秒后重试。建议在客户端实现缓存机制，避免频繁调用。

### Q: 激活码有效期是多久？

首次验证后 7 天内有效。

---

## 联系方式

如需获取激活码或有技术问题，请联系管理员。
