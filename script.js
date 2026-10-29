
document.addEventListener("DOMContentLoaded", function () {

    // 1. Smooth scrolling for links to sections
    const sectionLinks = document.querySelectorAll('a[href^="#"]');

    sectionLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (targetId && targetId.length > 1) {
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    event.preventDefault();

                    targetSection.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    // 2. Explore Collection button
    const exploreButton = document.querySelector(".hero button, .hero .btn");

    if (exploreButton) {
        exploreButton.addEventListener("click", function () {
            const collection = document.querySelector("#featured");

            if (collection) {
                collection.scrollIntoView({
                    behavior: "smooth"
                });
            } else {
                window.location.href = "shop.html";
            }
        });
    }

    // 3. Welcome message in the browser console
    console.log("StyleSphere is ready!");

});



const loginForm = document.getElementById("loginForm");
const accountStorageKey = "styleSphereAccounts";

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        login();
    });
}

function login() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    try {
        const accounts = JSON.parse(
            localStorage.getItem(accountStorageKey) || "[]"
        );
        const account = Array.isArray(accounts)
            ? accounts.find(function (savedAccount) {
                return savedAccount.email === email &&
                    savedAccount.password === password;
            })
            : null;

        if (account) {
            if (loginMessage) {
                loginMessage.textContent = "Login successful! Redirecting...";
                loginMessage.style.color = "#98712e";
            }

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 500);
        } else if (loginMessage) {
            loginMessage.textContent = "Invalid email or password.";
            loginMessage.style.color = "#c0392b";
        }
    } catch (error) {
        if (loginMessage) {
            loginMessage.textContent =
                "Unable to access saved accounts in this browser.";
            loginMessage.style.color = "#c0392b";
        }
    }
}


const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("signupMessage");
        const email =
            document.getElementById("signupEmail").value.trim().toLowerCase();

        if (password !== confirmPassword) {
            message.textContent = "Your passwords do not match.";
            message.style.color = "#c0392b";
            return;
        }

        try {
            const accounts = JSON.parse(
                localStorage.getItem(accountStorageKey) || "[]"
            );
            const savedAccounts = Array.isArray(accounts) ? accounts : [];
            const accountExists = savedAccounts.some(function (account) {
                return account.email === email;
            });

            if (accountExists) {
                message.textContent =
                    "An account with this email already exists. Please log in.";
                message.style.color = "#c0392b";
                return;
            }

            savedAccounts.push({
                name: document.getElementById("fullName").value.trim(),
                email: email,
                accountType: document.getElementById("accountType").value,
                password: password
            });
            localStorage.setItem(
                accountStorageKey,
                JSON.stringify(savedAccounts)
            );

            message.textContent =
                "Account created! You can now log in with your email and password.";
            message.style.color = "#98712e";
            signupForm.reset();
        } catch (error) {
            message.textContent =
                "Unable to save your account in this browser. Please try again.";
            message.style.color = "#c0392b";
        }
    });
}


const productGrid = document.getElementById("productGrid");

if (productGrid) {
    const products = productGrid.querySelectorAll(".shop-product");
    const searchInput = document.getElementById("productSearch");
    const searchButton = document.getElementById("searchButton");
    const categoryFilter = document.getElementById("categoryFilter");
    const noProducts = document.getElementById("noProducts");

    function filterProducts() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categoryFilter.value;
        let visibleCount = 0;

        products.forEach(function (product) {
            const text = product.textContent.toLowerCase();
            const productCategory = product.dataset.category;

            const matchesSearch = text.includes(query);
            const matchesCategory =
                category === "all" || productCategory === category;

            const show = matchesSearch && matchesCategory;

            product.hidden = !show;

            if (show) {
                visibleCount++;
            }
        });

        noProducts.hidden = visibleCount !== 0;
    }

    searchButton.addEventListener("click", filterProducts);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            filterProducts();
        }
    });

    categoryFilter.addEventListener("change", filterProducts);

    searchInput.addEventListener("input", filterProducts);
}


const addToCartButton = document.getElementById("addToCart");

if (addToCartButton) {
    addToCartButton.addEventListener("click", function () {
        const quantity = Number(
            document.getElementById("productQuantity").value
        );

        const size = document.getElementById("productSize").value;
        const message = document.getElementById("cartMessage");

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
            message.textContent = "Please choose a quantity from 1 to 10.";
            message.style.color = "#c0392b";
            return;
        }

        const product = {
            name: document.getElementById("detailName").textContent,
            price: document.getElementById("detailPrice").textContent,
            image: document.getElementById("detailImage").getAttribute("src"),
            size: size,
            quantity: quantity
        };

        let cart = [];

        try {
            cart = JSON.parse(localStorage.getItem("styleSphereCart")) || [];
        } catch {
            cart = [];
        }

        cart.push(product);
        localStorage.setItem("styleSphereCart", JSON.stringify(cart));

        message.textContent = "Added to cart! View your items in My Cart.";
        message.style.color = "#98712e";
    });
}


/* ==============================
   CATEGORIES PAGE
============================== */

const categoryLinks = document.querySelectorAll(".category-feature");

categoryLinks.forEach(function (category) {
    category.addEventListener("click", function () {
        const categoryName = category
            .querySelector("h2, h3")
            ?.textContent.trim()
            .toLowerCase();

        if (categoryName) {
            window.location.href =
                "shop.html?category=" +
                encodeURIComponent(categoryName);
        }
    });
});


/* ==============================
   DESIGNERS PAGE SEARCH
============================== */

const designerSearch = document.getElementById("designerSearch");
const designerCards = document.querySelectorAll(".designer-card");
const noDesignersMessage = document.getElementById("noDesignersMessage");

if (designerSearch) {
    designerSearch.addEventListener("input", function () {
        const searchText = designerSearch.value.toLowerCase().trim();
        let visibleCount = 0;

        designerCards.forEach(function (card) {
            const designerInfo = card.textContent.toLowerCase();
            const matches = designerInfo.includes(searchText);

            card.style.display = matches ? "" : "none";

            if (matches) {
                visibleCount++;
            }
        });

        if (noDesignersMessage) {
            noDesignersMessage.hidden = visibleCount !== 0;
        }
    });
}


/* ==============================
   DESIGNER PROFILE PAGE
============================== */

const profileName = document.getElementById("profileName");

if (profileName) {
    const params = new URLSearchParams(window.location.search);
    const designer = params.get("designer");

    const designerProfiles = {
        amara: {
            name: "Amara Designs",
            specialty: "African Fashion",
            description:
                "Creating unique African-inspired fashion that combines culture, confidence, and contemporary style.",
            story:
                "Amara Designs celebrates African prints through creative outfits designed for special occasions and everyday confidence.",
            image: "images/Aesthetic Ankara dress.jpg"
        },

        amanda: {
            name: "Amanda Luxe",
            specialty: "Bags & Accessories",
            description:
                "Elegant accessories designed to add a special touch to every outfit.",
            story:
                "Amanda Luxe focuses on stylish accessories and statement pieces for fashion lovers who appreciate elegant details.",
            image: "images/Amanda Handbag.jpg"
        },

        urban: {
            name: "Urban Threads",
            specialty: "Ready-to-Wear",
            description:
                "Modern everyday fashion with a clean, timeless feel.",
            story:
                "Urban Threads brings together comfortable silhouettes and modern styling for people who want effortless everyday fashion.",
            image: "images/30 Clean Girl Outfits To Copy For Effortless Style.jpg"
        }
    };

    const selectedDesigner = designerProfiles[designer];

    if (selectedDesigner) {
        profileName.textContent = selectedDesigner.name;

        document.getElementById("profileSpecialty").textContent =
            selectedDesigner.specialty;

        document.getElementById("profileDescription").textContent =
            selectedDesigner.description;

        document.getElementById("profileStory").textContent =
            selectedDesigner.story;

        document.getElementById("profileImage").src =
            selectedDesigner.image;

        document.getElementById("profileImage").alt =
            selectedDesigner.name + " fashion work";
    }
}


/* ==============================
   SHOPPING CART PAGE
============================== */

const cartItemsContainer = document.getElementById("cartItems");

if (cartItemsContainer) {
    const emptyCartMessage = document.getElementById("emptyCart");
    const cartItemCount = document.getElementById("cartItemCount");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    function getSavedCart() {
        try {
            const savedCart = JSON.parse(
                localStorage.getItem("styleSphereCart") || "[]"
            );

            return Array.isArray(savedCart) ? savedCart : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem("styleSphereCart", JSON.stringify(cart));
    }

    function formatPrice(price) {
        return "₦" + Number(price).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function renderCart() {
        const cart = getSavedCart();

        cartItemsContainer.innerHTML = "";

        const totalQuantity = cart.reduce(function (total, item) {
            return total + Math.max(1, Number(item.quantity) || 1);
        }, 0);

        cartItemCount.textContent =
            totalQuantity + (totalQuantity === 1 ? " item" : " items");

        emptyCartMessage.hidden = cart.length !== 0;
        cartItemsContainer.hidden = cart.length === 0;
        checkoutButton.disabled = cart.length === 0;

        let subtotal = 0;

        cart.forEach(function (item, index) {
            const quantity = Math.max(1, Number(item.quantity) || 1);
            const price = Number(item.price) || 0;
            const itemTotal = price * quantity;

            subtotal += itemTotal;

            const row = document.createElement("article");
            row.className = "cart-item";

            const image = document.createElement("img");
            image.src = item.image || "images/Aesthetic Ankara dress.jpg";
            image.alt = item.name || "Fashion item";

            const details = document.createElement("div");
            details.className = "cart-item-details";

            const name = document.createElement("h3");
            name.textContent = item.name || "Fashion item";

            const priceText = document.createElement("p");
            priceText.className = "cart-item-price";
            priceText.textContent = formatPrice(price);

            const actions = document.createElement("div");
            actions.className = "cart-item-actions";

            const quantityLabel = document.createElement("label");
            quantityLabel.textContent = "Qty: ";

            const quantityInput = document.createElement("input");
            quantityInput.className = "cart-quantity";
            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.max = "99";
            quantityInput.value = quantity;
            quantityInput.setAttribute(
                "aria-label",
                "Quantity for " + (item.name || "fashion item")
            );

            quantityInput.addEventListener("change", function () {
                const updatedCart = getSavedCart();
                const newQuantity = Math.max(
                    1,
                    Math.min(99, Number(quantityInput.value) || 1)
                );

                updatedCart[index].quantity = newQuantity;
                saveCart(updatedCart);
                renderCart();
            });

            quantityLabel.appendChild(quantityInput);

            const removeButton = document.createElement("button");
            removeButton.className = "remove-cart-item";
            removeButton.textContent = "Remove";
            removeButton.type = "button";

            removeButton.addEventListener("click", function () {
                const updatedCart = getSavedCart();
                updatedCart.splice(index, 1);
                saveCart(updatedCart);
                renderCart();
            });

            actions.appendChild(quantityLabel);
            actions.appendChild(removeButton);

            details.appendChild(name);
            details.appendChild(priceText);
            details.appendChild(actions);

            const total = document.createElement("div");
            total.className = "cart-item-total";
            total.textContent = formatPrice(itemTotal);

            row.appendChild(image);
            row.appendChild(details);
            row.appendChild(total);

            cartItemsContainer.appendChild(row);
        });

        cartSubtotal.textContent = formatPrice(subtotal);
        cartTotal.textContent = formatPrice(subtotal);
    }

    checkoutButton.addEventListener("click", function () {
        const cart = getSavedCart();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add a product first.");
            return;
        }

        alert(
            "Your cart is ready! A secure checkout and payment system " +
            "will be connected in a later stage."
        );
    });

    renderCart();
}


/* ==============================
   FASHION ACADEMY PAGE
============================== */

// Search and filter training programs
const courseSearch = document.getElementById("courseSearch");
const courseCards = document.querySelectorAll(".course-card");
const noCoursesMessage = document.getElementById("noCoursesMessage");

if (courseSearch) {
    courseSearch.addEventListener("input", function () {
        const searchText = courseSearch.value.toLowerCase().trim();
        let visibleCourses = 0;

        courseCards.forEach(function (card) {
            const courseInfo = card.textContent.toLowerCase();
            const matches = courseInfo.includes(searchText);

            card.style.display = matches ? "" : "none";

            if (matches) {
                visibleCourses++;
            }
        });

        if (noCoursesMessage) {
            noCoursesMessage.hidden = visibleCourses !== 0;
        }
    });
}

// Training application buttons
const applyButtons = document.querySelectorAll(".apply-course-button");

applyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const courseName = button.dataset.course;

        const confirmApplication = confirm(
            "You selected: " + courseName +
            "\n\nYou will need an account to continue. " +
            "Would you like to go to the sign-up page?"
        );

        if (confirmApplication) {
            window.location.href = "signup.html";
        }
    });
});


/* ==============================
   CONTACT PAGE FORM
============================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    const contactFeedback = document.getElementById("contactFeedback");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !subject || !message) {
            contactFeedback.textContent =
                "Please complete every field before continuing.";

            return;
        }

        contactFeedback.textContent =
            "Thank you, " + name +
            "! Your form has been validated successfully. " +
            "Messages cannot be delivered yet because this prototype " +
            "is not connected to an email service.";

        contactForm.reset();
    });
}
