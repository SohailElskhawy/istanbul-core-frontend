type product = {
    id: number;
    title: string;
    price: number;
}

const products: product[] = [
    {
        id:1,
        title: "Laptop",
        price: 1000
    },
    {
        id:2,
        title: "Smartphone",
        price: 500
    }
];

function formatPrice(price: number): string {
    return `${price} $`;
}

const productTitles: string[] = products.map(product => product.title);