
const defaultProducts = [
    {
        id: 1,
        name: "Used Laptop",
        price: 25000,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        description: "Used laptop in good working condition."
    },
    {
        id: 2,
        name: "Study Table",
        price: 3000,
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
        description: "Study table in good condition."
    },
    {
        id: 3,
        name: "Programming Book",
        price: 500,
        category: "Books",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        description: "Programming book for students."
    },
    {
        id: 4,
        name: "Used Bicycle",
        price: 7000,
        category: "Vehicles",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
        description: "Used bicycle in good condition."
    }
];

let products = [];

try {
    const saved = localStorage.getItem("products");
    products = saved ? JSON.parse(saved) : defaultProducts;

    if (!Array.isArray(products)) {
        products = defaultProducts;
    }
} catch (error) {
    products = defaultProducts;
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function displayProducts() {
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("search");
    const categoryInput = document.getElementById("category");

    if (!productList || !searchInput || !categoryInput) return;

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryInput.value;

    productList.innerHTML = "";

    const filteredProducts = products.filter(function(product) {
        const matchesSearch = product.name.toLowerCase().includes(searchText);
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    filteredProducts.forEach(function(product) {
        const card = document.createElement("div");
        card.className = "product";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.onerror = function() {
            this.alt = "Image unavailable";
            this.removeAttribute("src");
        };

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "₹" + Number(product.price).toLocaleString("en-IN");

        const category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        const description = document.createElement("p");
        description.textContent = product.description;

        const buyButton = document.createElement("button");
        buyButton.className = "buy-button";
        buyButton.textContent = "Buy Now";
        buyButton.addEventListener("click", function() {
            buyProduct(product.id);
        });

        card.append(image, name, price, category, description, buyButton);
        productList.appendChild(card);
    });
}

function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("price").value);
    const category = document.getElementById("productCategory").value;
    const image = document.getElementById("image").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!name || !Number.isFinite(price) || price <= 0 ||
        !image || !description) {
        alert("Please enter all product details correctly.");
        return;
    }

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: image,
        description: description
    };

    products.push(newProduct);
    saveProducts();

    document.getElementById("sellForm").reset();
    showHome();
    displayProducts();
}

function buyProduct(productId) {
    const product = products.find(function(item) {
        return String(item.id) === String(productId);
    });

    if (!product) return;

    localStorage.setItem("selectedProduct", JSON.stringify(product));

    // Open the checkout page without showing a notification.
    window.location.href = "checkout.html";
}

function showHome() {
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("sell").classList.add("hidden");
}

function showSell() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("sell").classList.remove("hidden");
}

document.getElementById("sellForm").addEventListener("submit", addProduct);

displayProducts();
