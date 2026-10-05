const fs = require("fs");
const path = require("path");
const { validateForm } = require("./script.js");

let passed = true;
let total = 0;
let failed = 0;

console.log("Registration Test\n");

function check(id, condition, extra) {
    total++;
    if (condition) {
        console.log(`${id} : PASS`);
    } else {
        console.log(`${id} : FAIL${extra ? " - " + extra : ""}`);
        passed = false;
        failed++;
    }
}

// Base valid form data used as a starting point for each test
function baseData(overrides = {}) {
    return {
        name: "Aarav Sharma",
        email: "aarav@example.com",
        mobile: "9876543210",
        branch: "Computer Science Engineering",
        password: "secret123",
        ...overrides
    };
}

// ---------- File existence ----------

check("TC-01 : index.html exists", fs.existsSync(path.join(__dirname, "index.html")));
check("TC-02 : style.css exists", fs.existsSync(path.join(__dirname, "style.css")));
check("TC-03 : script.js exists", fs.existsSync(path.join(__dirname, "script.js")));

// ---------- Happy path ----------

{
    const { isValid, errors } = validateForm(baseData());
    check("TC-04 : valid form data passes validation", isValid === true && Object.keys(errors).length === 0);
}

// ---------- Name ----------

{
    const { isValid, errors } = validateForm(baseData({ name: "" }));
    check("TC-05 : empty name is rejected", isValid === false && errors.name === "Name is required.");
}
{
    const { isValid, errors } = validateForm(baseData({ name: "   " }));
    check("TC-06 : whitespace-only name is rejected", isValid === false && errors.name === "Name is required.");
}

// ---------- Email ----------

{
    const { isValid, errors } = validateForm(baseData({ email: "" }));
    check("TC-07 : empty email is rejected", isValid === false && errors.email === "Email ID is required.");
}
{
    const { isValid, errors } = validateForm(baseData({ email: "aaravexample.com" }));
    check("TC-08 : email missing @ is rejected", isValid === false && errors.email === "Email ID must contain @.");
}
{
    const { isValid, errors } = validateForm(baseData({ email: "aarav@example.com" }));
    check("TC-09 : well-formed email is accepted", isValid === true && !errors.email);
}

// ---------- Mobile ----------

{
    const { isValid, errors } = validateForm(baseData({ mobile: "" }));
    check("TC-10 : empty mobile is rejected", isValid === false && errors.mobile === "Mobile number is required.");
}
{
    const { isValid, errors } = validateForm(baseData({ mobile: "98765" }));
    check("TC-11 : mobile with fewer than 10 digits is rejected", isValid === false && errors.mobile === "Mobile number must be exactly 10 digits.");
}
{
    const { isValid, errors } = validateForm(baseData({ mobile: "987654321099" }));
    check("TC-12 : mobile with more than 10 digits is rejected", isValid === false && errors.mobile === "Mobile number must be exactly 10 digits.");
}
{
    const { isValid, errors } = validateForm(baseData({ mobile: "98765abcde" }));
    check("TC-13 : mobile with non-numeric characters is rejected", isValid === false && errors.mobile === "Mobile number must be exactly 10 digits.");
}
{
    const { isValid, errors } = validateForm(baseData({ mobile: "9876543210" }));
    check("TC-14 : 10-digit numeric mobile is accepted", isValid === true && !errors.mobile);
}

// ---------- Branch ----------

{
    const { isValid, errors } = validateForm(baseData({ branch: "" }));
    check("TC-15 : empty branch selection is rejected", isValid === false && errors.branch === "Please select a branch.");
}
{
    const { isValid, errors } = validateForm(baseData({ branch: "Information Technology" }));
    check("TC-16 : selected branch is accepted", isValid === true && !errors.branch);
}

// ---------- Password ----------

{
    const { isValid, errors } = validateForm(baseData({ password: "" }));
    check("TC-17 : empty password is rejected", isValid === false && errors.password === "Password is required.");
}
{
    const { isValid, errors } = validateForm(baseData({ password: "abc12" }));
    check("TC-18 : password under 6 characters is rejected", isValid === false && errors.password === "Password must contain at least 6 characters.");
}
{
    const { isValid, errors } = validateForm(baseData({ password: "abc123" }));
    check("TC-19 : password with exactly 6 characters is accepted", isValid === true && !errors.password);
}

// ---------- Multiple simultaneous errors ----------

{
    const { isValid, errors } = validateForm({
        name: "",
        email: "bad-email",
        mobile: "123",
        branch: "",
        password: "abc"
    });
    check(
        "TC-20 : all-invalid submission reports every field error",
        isValid === false &&
        Object.keys(errors).length === 5
    );
}

// ---------- Summary ----------

console.log(`\n${total - failed}/${total} tests passed.`);

if (!passed) {
    console.log("\nRegistration Test Suite: FAILED");
    process.exit(1);
} else {
    console.log("\nRegistration Test Suite: PASSED");
    process.exit(0);
}
