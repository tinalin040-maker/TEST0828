// 模擬的業績資料陣列
const salesData = [
    { date: "2026-08-25", name: "王小明", amount: 12000 },
    { date: "2026-08-26", name: "李小華", amount: 25000 },
    { date: "2026-08-27", name: "張阿姨", amount: 18000 },
    { date: "2026-08-28", name: "王小明", amount: 31000 },
    { date: "2026-08-28", name: "陳大文", amount: 14000 }
];

// 預設顏色陣列 (給圓餅圖各扇形使用)
const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

// 1. 初始化頁面數據與表格
function renderDashboard() {
    let totalSales = 0;
    let totalOrders = salesData.length;
    const tableBody = document.getElementById("sales-table-body");

    tableBody.innerHTML = "";

    salesData.forEach(function(item) {
        totalSales += item.amount;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.name}</td>
            <td>$${item.amount.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });

    const avgValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    document.getElementById("total-sales").textContent = `$${totalSales.toLocaleString()}`;
    document.getElementById("total-orders").textContent = totalOrders;
    document.getElementById("avg-order-value").textContent = `$${avgValue.toLocaleString()}`;

    // 渲染資料完成後，繪製原生圓餅圖
    drawNativePieChart(totalSales);
}

// 2. 原生 Canvas 繪製圓餅圖 (不需外連任何套件)
function drawNativePieChart(totalSales) {
    const canvas = document.getElementById("salesPieChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 統計每個人銷售額
    const personMap = {};
    salesData.forEach(function(item) {
        personMap[item.name] = (personMap[item.name] || 0) + item.amount;
    });

    const names = Object.keys(personMap);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;
    const radius = 80;

    let startAngle = 0;

    // 繪製圓餅圖扇形區域
    names.forEach(function(name, index) {
        const amount = personMap[name];
        const sliceAngle = (amount / totalSales) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        startAngle += sliceAngle;
    });

    // 繪製下方圖例
    let legendY = canvas.height - 40;
    let legendX = 20;

    names.forEach(function(name, index) {
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(legendX, legendY, 12, 12);

        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.fillText(name, legendX + 18, legendY + 10);

        legendX += 65;
    });
}

// 執行主程式
renderDashboard();