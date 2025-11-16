### 🔹 API: `getAvailableAssets`

**Description:**

- Get all of different assets from db
- the api is for user selecting in the dropdown menu

**Method:** `GET`
**Endpoint:** `api/v1/assets`
**Parameters:**
**Success Response:**

```json
{
    "data":  {
      "assets":
      ["XXX ETF", "TSMC", "AAPL"]
    },
    "code": 1,
    "message": "the total assets class is retrieved"
}
{
    "data": {},
    "code": 0,
    "message": "the total assets class is fail to be retrieved"
}
```

**Failure Response:**

```json
{
  "data": {},
  "code": 0,
  "message": "the total assets class is fail to be retrieved"
}
```

### 🔹 API: `getAssetHistoricalPrice`

**Description:**

- Search available historical price of Asset.
- We have fixed Asset ( ex S&P 500, ETF )
- User would select the asset from dropdown menu, and each option is the fixed asset

                <select
                  value={asset.assetName || ""}
                >
                  <option value="" disabled>
                    Select Asset Class...
                  </option>
                  <option value="Equity">Equity</option>
                  <option value="Bond">Bond</option>
                  <option value="Cash">Cash</option>
                </select>

**Method:** `GET`
**Endpoint:** `api/v1/assets/price/{assetName}`
**Parameters:**

| Name        | Type   | Required | Description    |
| ----------- | ------ | -------- | -------------- |
| `assetName` | string | ✅       | name of asset. |

**Success Response:**

```json
{
    "data": {
      "assetName": "XXX ETF",
      "historicalPrice":{
        "2024-01-01":100,
        "2024-01-01":100,
        "2024-01-01":120
      },
    },
    "code":  1,
    "message": "the historical price is successfully retrieved"
}
{
    "data": {},
    "code": 0,
    "message": "the historical price is fail to be retrieved",
}

```
