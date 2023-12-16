const productList = document.querySelector(".productList");
const searchInput = document.querySelector(".searchInput");
const categorySelectList=document.querySelector(".categoryList");
var allProducts = [];

async function fetchProductData() {
    try {
        const httpRes = await fetch('https://fakestoreapi.com/products');
        const productsData = await httpRes.json();
        allProducts = productsData;
        return productsData;
    } catch (err) {
        console.log("Error" + err);
        return [];
    }
}

async function displayProductsAndCategories() {
    const productsData = await fetchProductData();
    renderCategories(productsData);
    renderProducts(productsData);
}



function renderCategories(productsData){
    const categories=getCategories(productsData);

    const select=document.createElement("select");
    select.setAttribute("name","category");
    select.id="category";

   

     const option =document.createElement("option");
        option.setAttribute("value",null);
        option.textContent="None";
   select.appendChild(option);



   select.addEventListener("change",onCategoryChange);

   
    categories.forEach((category)=>{
        const option =document.createElement("option");
        option.setAttribute("value",category);
        option.textContent=category;
       select.appendChild(option);

        

    })
    categorySelectList.appendChild(select);

}


function onCategoryChange(e){

    const selectedCategory=e.target.value;
    if(selectedCategory==="null"){ 
        renderProducts(allProducts);
        return ;
    }
   const filteredProducts= allProducts.filter((product)=>{
     
    return product.category===selectedCategory;

   })
   renderProducts(filteredProducts);

};




function getCategories(productsData){
    const categories=new Set();
    productsData.forEach((product)=>{
categories.add(product.category);
    })
    return Array.from(categories);
}




function renderProducts(productsData) {
    productList.innerHTML = ''; // Clear the productList outside the loop
    productsData.forEach((productData) => {
        // create a product 
        const product = createProduct(productData);
        productList.appendChild(product);
    });
}

function createProduct(productData) {
    const product = document.createElement("div");
    product.className = "product";

    const productImg = document.createElement("div");
    productImg.className = "productImg";
    const img = document.createElement("img");
    img.setAttribute("src", productData.image);
    productImg.appendChild(img);

    const productDescription = document.createElement("div");
    productDescription.className = "productDescription";
    const productTitle = document.createElement("p");
    productTitle.className = "productTitle";
    productTitle.textContent = productData.title;

    const productRatings = document.createElement("div");
    productRatings.className = "productRatings";
    const ratings = document.createElement("span");
    const count = document.createElement("span");
    ratings.textContent = `Ratings ${productData.rating.rate}/5`;
    count.textContent = `${productData.rating.count} reviews`;
    productRatings.appendChild(ratings);
    productRatings.appendChild(count);

    const productCategory = document.createElement("p");
    productCategory.className = "productCategory"; // Corrected class name
    productCategory.textContent = `Category: ${productData.category}`;

    const productPrice = document.createElement("p");
    productPrice.className = "productPrice";
    productPrice.textContent = `Rs. ${productData.price}`;

    productDescription.appendChild(productTitle);
    productDescription.appendChild(productRatings);
    productDescription.appendChild(productCategory);
    productDescription.appendChild(productPrice);

    product.appendChild(productImg);
    product.appendChild(productDescription);
    return product;
}

displayProductsAndCategories();

searchInput.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredProducts = allProducts.filter((product) => {
        return product.title.toLowerCase().startsWith(searchText);
    });
    renderProducts(filteredProducts);
});
