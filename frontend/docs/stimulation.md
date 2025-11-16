### 🔹 API: `stimulatePortfolioPerformance`

**Description:**

- get stimulated performance of portfolio in the future
- run the Monte Carlo stimulation 10000 times

```python
import numpy as np

def stimulatePortfolioPerformance(portfolioId):
    # 1️⃣ Get past portfolio values (daily data for 1 year)
    portfolio_values = helper(portfolioId)  # returns a pandas Series or np.array of daily values

    # 2️⃣ Compute daily returns
    daily_returns = portfolio_values[1:] / portfolio_values[:-1] - 1

    # 3️⃣ Compute mean and variance of daily returns
    mean_return = np.mean(daily_returns)
    var_return = np.var(daily_returns)

    # 4️⃣ Set parameters for GBM simulation
    annual_mu = mean_return * 252    # assuming 252 trading days per year
    annual_sigma = np.sqrt(var_return * 252)
    years = 30
    n_sim = 10_000
    dt = 1  # yearly step
    initial_value = portfolio_values[-1]

    # 5️⃣ Run Monte Carlo simulations (track values over time)
    sim_results = np.zeros((n_sim, years + 1))
    sim_results[:, 0] = initial_value

    for t in range(1, years + 1):
        Z = np.random.normal(0, 1, n_sim)
        sim_results[:, t] = sim_results[:, t - 1] * np.exp(
            (annual_mu - 0.5 * annual_sigma**2) * dt + annual_sigma * np.sqrt(dt) * Z
        )

    # 6️⃣ Compute percentiles over time
    percentiles = {
        "10th": np.percentile(sim_results, 10, axis=0),
        "25th": np.percentile(sim_results, 25, axis=0),
        "50th": np.percentile(sim_results, 50, axis=0),
        "75th": np.percentile(sim_results, 75, axis=0),
        "90th": np.percentile(sim_results, 90, axis=0),
    }

    return percentiles

```

**Method:** `GET`
**Endpoint:** `/api/v1/stimulation/{portfolioId}`

**Success Response:**

```json
{
  "data": {
    "portfolioId": 0,
    "name": "portfolio1",
    "portfolioVal": [
        {"10th": [100, 120, 200, 500, ..., 1000]}, // the result should has length of thirty (30 years)
        {"25th": [100, 120, 200, 500, ..., 1000]},
        {"50th": [100, 120, 200, 500, ..., 1000]},
        {"75th": [100, 120, 200, 500, ..., 1000]},
        {"90th": [100, 120, 200, 500, ..., 1000]},
    ]
  },
  "code": 1,
  "message": "successfully stimulate"
}
```

**Failure Response:**

```json
{
  "data": [],
  "code": 0,
  "message": "fail to stimulate"
}
```
