import { useState, useEffect } from "react";

export default function Home() {
  const [filter, setFilter] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Load pricing data from JSON file
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await import("../data/pricingData.json"); // Dynamic import
        setSortedData(response.default);
        setFilteredData(response.default); // Initialize with full data
      } catch (error) {
        console.error("Error loading pricing data:", error);
      }
    };
    fetchPricingData();
  }, []);

  // Handle sorting by column
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (typeof a[key] === "number") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setSortConfig({ key, direction });
    setSortedData(sorted);
    setFilteredData(
      sorted.filter((item) =>
        item.model.toLowerCase().includes(filter.toLowerCase())
      )
    );
  };

  // Handle filtering by search input
  const handleFilter = (e) => {
    const value = e.target.value;
    setFilter(value);
    setFilteredData(
      sortedData.filter((item) =>
        item.model.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Get the sort icon for a column
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "⇅";
  };

  // Extract the prefix of the provider before "_"
  const getProviderDisplay = (provider) => {
    return provider.includes("_") ? provider.split("_")[0] : provider;
  };

  // Map provider names to their corresponding image paths
  const getProviderIcon = (provider) => {
    const providerName = getProviderDisplay(provider);
    const iconPath = `/images/${providerName}.svg`;
    return iconPath;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "5px" }}>
          LLM Pricing Table
        </h1>
        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            fontSize: "14px",
            marginBottom: "20px",
            color: "#d4d4d4",
          }}
        >
          Last Scraped Jan. 12th 2025; For US-East unless otherwise stated
        </p>
        <input
          type="text"
          placeholder="Search by model name"
          value={filter}
          onChange={handleFilter}
          style={{
            display: "block",
            margin: "0 auto 20px auto",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #3c3c3c",
            backgroundColor: "#252526",
            color: "#d4d4d4",
            width: "90%",
            maxWidth: "400px",
          }}
        />
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#252526",
            border: "1px solid #3c3c3c",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#2d2d2d",
                  borderBottom: "1px solid #3c3c3c",
                }}
                onClick={() => handleSort("model")}
              >
                Model Name {getSortIcon("model")}
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#2d2d2d",
                  borderBottom: "1px solid #3c3c3c",
                }}
                onClick={() => handleSort("inputCost")}
              >
                Input Cost ($ USD / M tokens) {getSortIcon("inputCost")}
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#2d2d2d",
                  borderBottom: "1px solid #3c3c3c",
                }}
                onClick={() => handleSort("outputCost")}
              >
                Output Cost ($ USD / M tokens) {getSortIcon("outputCost")}
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#2d2d2d",
                  borderBottom: "1px solid #3c3c3c",
                }}
                onClick={() => handleSort("provider")}
              >
                Provider {getSortIcon("provider")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                style={{
                  textAlign: "center",
                  backgroundColor: index % 2 === 0 ? "#2d2d2d" : "#1e1e1e",
                }}
              >
                <td style={{ padding: "10px", border: "1px solid #3c3c3c" }}>
                  {item.model}
                </td>
                <td style={{ padding: "10px", border: "1px solid #3c3c3c" }}>
                  {item.inputCost.toFixed(2)}
                </td>
                <td style={{ padding: "10px", border: "1px solid #3c3c3c" }}>
                  {item.outputCost.toFixed(2)}
                </td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                    border: "1px solid #3c3c3c",
                  }}
                >
                  <img
                    src={getProviderIcon(item.provider)}
                    alt={getProviderDisplay(item.provider)}
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  {getProviderDisplay(item.provider)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
