// Data Arrays
export const products = [
    { id: 1, name: "Mechanical Keyboard", category: "Electronics", price: 119.99 },
    { id: 2, name: "Wireless Ergonomic Mouse", category: "Electronics", price: 59.50 },
    { id: 3, name: "4K Ultra-HD Monitor", category: "Electronics", price: 349.00 },
    { id: 4, name: "Noise Cancelling Headphones", category: "Audio", price: 199.99 },
    { id: 5, name: "USB-C Multi-port Hub", category: "Accessories", price: 45.00 },
    { id: 6, name: "Standing Desk Mat", category: "Office", price: 39.95 },
    { id: 7, name: "Smart Water Bottle", category: "Lifestyle", price: 29.99 },
    { id: 8, name: "LED Desk Lamp with Wireless Charger", category: "Office", price: 49.99 }
];
export const users = [
    { id: 101, name: "Sarah Connor", email: "sarah.connor@example.com", role: "Manager" },
    { id: 102, name: "John Doe", email: "john.doe@example.com", role: "Developer" },
    { id: 103, name: "Alice Johnson", email: "alice.j@example.com", role: "Designer" },
    { id: 104, name: "Michael Chang", email: "m.chang@example.com", role: "Product Owner" },
    { id: 105, name: "Emma Watson", email: "emma.w@example.com", role: "QA Engineer" },
    { id: 106, name: "David Miller", email: "david.m@example.com", role: "DevOps" },
    { id: 107, name: "Sophia Martinez", email: "sophia.m@example.com", role: "Developer" }
];
// Generic Helper Function
export function getRandomElement(array) {
    if (array.length === 0) {
        throw new Error("Cannot get random element from an empty array");
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
// DOM Initialization
let rowCount = 0;
export function addRandomRow() {
    if (typeof document === 'undefined')
        return;
    const tableBody = document.getElementById("table-body");
    const emptyState = document.getElementById("empty-state");
    const rowCountBadge = document.getElementById("row-count");
    if (!tableBody)
        return;
    // Remove empty state placeholder if present
    if (emptyState && emptyState.parentElement) {
        emptyState.remove();
    }
    // Pick random items
    const randomProduct = getRandomElement(products);
    const randomUser = getRandomElement(users);
    rowCount++;
    if (rowCountBadge) {
        rowCountBadge.textContent = `${rowCount} ${rowCount === 1 ? 'entry' : 'entries'}`;
    }
    // Create table row
    const row = document.createElement("tr");
    row.className = "fade-in-row";
    // Format currency
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(randomProduct.price);
    row.innerHTML = `
        <td class="row-index">#${rowCount}</td>
        <td>
            <div class="product-name">${randomProduct.name}</div>
            <div class="product-id">ID: ${randomProduct.id}</div>
        </td>
        <td><span class="badge badge-category">${randomProduct.category}</span></td>
        <td class="product-price">${formattedPrice}</td>
        <td>
            <div class="user-name">${randomUser.name}</div>
            <div class="user-id">ID: ${randomUser.id}</div>
        </td>
        <td class="user-email">${randomUser.email}</td>
        <td><span class="badge badge-role">${randomUser.role}</span></td>
    `;
    tableBody.appendChild(row);
}
export function init() {
    if (typeof document === 'undefined')
        return;
    const addRowBtn = document.getElementById("add-row-btn");
    if (addRowBtn) {
        addRowBtn.addEventListener("click", addRandomRow);
    }
}
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    else {
        init();
    }
}
