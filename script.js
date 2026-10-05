const validationRules = {
    name: (value) => value.trim() ? '' : 'Name is required.',
    email: (value) => {
        const val = value.trim();
        if (!val) return 'Email ID is required.';
        if (!val.includes('@')) return 'Email ID must contain @.';
        return '';
    },
    mobile: (value) => {
        const val = value.trim();
        if (!val) return 'Mobile number is required.';
        if (!/^\d{10}$/.test(val)) return 'Mobile number must be exactly 10 digits.';
        return '';
    },
    branch: (value) => value ? '' : 'Please select a branch.',
    password: (value) => {
        if (!value) return 'Password is required.';
        if (value.length < 6) return 'Password must contain at least 6 characters.';
        return '';
    }
};

function showError(field, message) {
    const input = document.getElementById(field);
    if (input) {
        input.classList.toggle('invalid', Boolean(message));
        input.setAttribute('aria-invalid', Boolean(message));
    }
    const errorDiv = document.getElementById(field + 'Error');
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

function validateForm(data) {
    const errors = {};
    let isValid = true;
    for (const field in validationRules) {
        const error = validationRules[field](data[field]);
        if (error) {
            errors[field] = error;
            isValid = false;
        }
    }
    return { isValid, errors };
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('registrationForm');
        const fields = ['name', 'email', 'mobile', 'branch', 'password'];

        if (!form) return;

        form.mobile.addEventListener('input', () => {
            form.mobile.value = form.mobile.value.replace(/\D/g, '').slice(0, 10);
        });

        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', () => {
                    showError(field, '');
                    const successMessage = document.getElementById('successMessage');
                    if (successMessage) successMessage.style.display = 'none';
                });
            }
        });

        form.addEventListener('submit', async event => {
            event.preventDefault();
            const successMessage = document.getElementById('successMessage');
            if (successMessage) successMessage.style.display = 'none';

            const formData = {
                name: form.name.value,
                email: form.email.value,
                mobile: form.mobile.value,
                branch: form.branch.value,
                password: form.password.value
            };

            const { isValid, errors } = validateForm(formData);

            fields.forEach(field => {
                showError(field, errors[field] || '');
            });

            if (isValid) {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Saving...';
                }

                try {
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        if (successMessage) {
                            successMessage.textContent = result.message || 'Registration successful!';
                            successMessage.style.display = 'block';
                        }
                        console.log('Student Saved:', result);
                        form.reset();
                    } else {
                        alert(result.message || 'Failed to save student registration.');
                    }
                } catch (error) {
                    console.error('Error saving student:', error);
                    alert('Could not connect to server. Ensure the server is running.');
                } finally {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Register';
                    }
                }
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validationRules, validateForm };
}