const fetchData = async () => {
    try {
        const products = await fetch('https://dummyjson.com/products');
        const data = await products.json();
        const categories = data.products.map(product => product.category);
        return categories;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const displayCategories = async () => {
    const categories = await fetchData();
    const uniqueCategories = [...new Set(categories)];
    const categoryList = document.getElementById('category-list');

    uniqueCategories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category;
        categoryList.appendChild(listItem);
    })
}

document.addEventListener('DOMContentLoaded', displayCategories);