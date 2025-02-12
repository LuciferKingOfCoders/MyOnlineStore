document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("order-form");
    const productForm = document.getElementById("product-form");
    const paymentForm = document.getElementById("payment-form");
    const submitButton = document.getElementById("submit-button");
    const receiptContent = document.getElementById("receipt-content");
    const receiptSection = document.getElementById("receipt");

    // Error message spans
    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");
    const postcodeError = document.getElementById("postcode-error");
    const addressError = document.getElementById("address-error");
    const cityError = document.getElementById("city-error");
    const provinceError = document.getElementById("province-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
    const creditCardError = document.getElementById("credit-card-error");
    const expiryMonthError = document.getElementById("expiry-month-error");
    const expiryYearError = document.getElementById("expiry-year-error");


    submitButton.addEventListener("click", function () {
        // Reset error messages
        resetErrors();

        // Validate form
        let isValid = validateForm();

        if (isValid) {
            // Generate receipt
            generateReceipt();
        }
    });

    function resetErrors() {
        document.querySelectorAll(".error-message").forEach(span => {
            span.textContent = "";
            span.style.display = "none";
        });
    }

    function validateForm() {
        let isValid = true;

        // Mandatory fields validation
        isValid = isValid && validateMandatoryField("name", nameError);
        isValid = isValid && validateMandatoryField("phone", phoneError);
        isValid = isValid && validateMandatoryField("postcode", postcodeError);
        isValid = isValid && validateMandatoryField("address", addressError);
        isValid = isValid && validateMandatoryField("city", cityError);
        isValid = isValid && validateMandatoryField("province", provinceError);
        isValid = isValid && validateMandatoryField("email", emailError);
        isValid = isValid && validateMandatoryField("password", passwordError);
        isValid = isValid && validateMandatoryField("confirm-password", confirmPasswordError);
        isValid = isValid && validateMandatoryField("credit-card", creditCardError);
        isValid = isValid && validateMandatoryField("expiry-month", expiryMonthError);
        isValid = isValid && validateMandatoryField("expiry-year", expiryYearError);

        // Specific format validation
        isValid = isValid && validateCreditCard("credit-card", creditCardError);
        isValid = isValid && validateExpiryMonth("expiry-month", expiryMonthError);
        isValid = isValid && validateExpiryYear("expiry-year", expiryYearError);
        isValid = isValid && validateEmail("email", emailError);

        // Password match validation
        isValid = isValid && validatePasswordMatch("password", "confirm-password", passwordError, confirmPasswordError);

        return isValid;
    }

    function validateMandatoryField(fieldId, errorElement) {
        const field = document.getElementById(fieldId);
        if (field.value.trim() === "") {
            errorElement.textContent = "This field is required.";
            errorElement.style.display = "block";
            return false;
        }
        return true;
    }

    function validateCreditCard(fieldId, errorElement) {
        const field = document.getElementById(fieldId);
        const creditCardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        if (!creditCardRegex.test(field.value)) {
            errorElement.textContent = "Credit Card must be in the format xxxx-xxxx-xxxx-xxxx";
            errorElement.style.display = "block";
            return false;
        }
        return true;
    }

    function validateExpiryMonth(fieldId, errorElement) {
        const field = document.getElementById(fieldId);
        const expiryMonthRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i; // Case-insensitive
        if (!expiryMonthRegex.test(field.value)) {
            errorElement.textContent = "Expiry Month must be in the format MMM (e.g., JAN)";
            errorElement.style.display = "block";
            return false;
        }
        return true;
    }

    function validateExpiryYear(fieldId, errorElement) {
        const field = document.getElementById(fieldId);
        const expiryYearRegex = /^\d{4}$/;
        if (!expiryYearRegex.test(field.value)) {
            errorElement.textContent = "Expiry Year must be in the format yyyy (e.g., 2024)";
            errorElement.style.display = "block";
            return false;
        }
        return true;
    }

    function validateEmail(fieldId, errorElement) {
        const field = document.getElementById(fieldId);
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(field.value)) {
            errorElement.textContent = "Email must be in the format x@y.z";
            errorElement.style.display = "block";
            return false;
        }
        return true;
    }

    function validatePasswordMatch(passwordFieldId, confirmPasswordFieldId, passwordErrorElement, confirmPasswordErrorElement) {
        const password = document.getElementById(passwordFieldId).value;
        const confirmPassword = document.getElementById(confirmPasswordFieldId).value;
        if (password !== confirmPassword) {
            confirmPasswordErrorElement.textContent = "Passwords do not match.";
            confirmPasswordErrorElement.style.display = "block";
            return false;
        }
        return true;
    }

    function generateReceipt() {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const city = document.getElementById("city").value;
        const postcode = document.getElementById("postcode").value;
        const province = document.getElementById("province").value;
        const email = document.getElementById("email").value;

        // Product quantities and prices
        const book1Quantity = parseInt(document.getElementById("book1-quantity").value);
        const book2Quantity = parseInt(document.getElementById("book2-quantity").value);
        const book3Quantity = parseInt(document.getElementById("book3-quantity").value);
        const book1Price = 12.99;
        const book2Price = 9.99;
        const book3Price = 14.99;

        // Calculate subtotal
        const book1Subtotal = book1Quantity * book1Price;
        const book2Subtotal = book2Quantity * book2Price;
        const book3Subtotal = book3Quantity * book3Price;
        let subtotal = book1Subtotal + book2Subtotal + book3Subtotal;

        if (subtotal < 10) {
            receiptContent.innerHTML = "<p class='error-message'>Minimum purchase should be of $10.</p>";
            receiptSection.style.display = "block"; // Show the receipt section to display the error message
            return;
        }

        // Calculate sales tax based on province (simplified)
        let taxRate = 0;
        switch (province) {
            case "ON": taxRate = 0.13; break; // Ontario
            case "QC": taxRate = 0.14975; break; // Quebec
            case "BC": taxRate = 0.12; break; // British Columbia
            case "AB": taxRate = 0.05; break; // Alberta
            case "MB": taxRate = 0.05; break; // Manitoba
            case "SK": taxRate = 0.11; break; // Saskatchewan
            case "NS": taxRate = 0.15; break; // Nova Scotia
            case "NB": taxRate = 0.15; break; // New Brunswick
            case "PE": taxRate = 0.15; break; // Prince Edward Island
            case "NL": taxRate = 0.15; break; // Newfoundland and Labrador
            case "NT": taxRate = 0.05; break; // Northwest Territories
            case "YT": taxRate = 0.05; break; // Yukon
            case "NU": taxRate = 0.05; break; // Nunavut

            default: taxRate = 0.05;
        }
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount;

        // Generating HTML for the receipt
        let receiptHTML = `
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Postcode:</strong> ${postcode}</p>
            <p><strong>Province:</strong> ${province}</p>
            <p><strong>Email:</strong> ${email}</p>

            <h3>Order Details:</h3>
            <ul>
                <li>The Secret Garden: ${book1Quantity} x $${book1Price.toFixed(2)} = $${book1Subtotal.toFixed(2)}</li>
                <li>Pride and Prejudice: ${book2Quantity} x $${book2Price.toFixed(2)} = $${book2Subtotal.toFixed(2)}</li>
                <li>To Kill a Mockingbird: ${book3Quantity} x $${book3Price.toFixed(2)} = $${book3Subtotal.toFixed(2)}</li>
            </ul>

            <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
            <p><strong>Tax (${(taxRate * 100).toFixed(2)}%):</strong> $${taxAmount.toFixed(2)}</p>
            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        `;

        receiptContent.innerHTML = receiptHTML;
        receiptSection.style.display = "block"; // receipt section
    }
});