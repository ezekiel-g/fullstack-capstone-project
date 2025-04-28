const validateUser = {
    validateFirstName: firstName => {
        if (!firstName) {
            return { valid: false, message: 'First name is required' }
        }
        if (firstName.length < 2) {
            return {
                valid: false,
                message: 'First name must be at least 2 characters'
            }
        }
        return { valid: true, message: '' }
    },

    validateLastName: lastName => {
        if (!lastName) {
            return { valid: false, message: 'Last name is required' }
        }
        if (lastName.length < 2) {
            return {
                valid: false,
                message: 'Last name must be at least 2 characters'
            }
        }
        return { valid: true, message: '' }
    },

    validateEmail: email => {
        if (!email) {
            return { valid: false, message: 'Email address is required' }
        }
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!emailRegex.test(email)) {
            return {
                valid: false,
                message: 'Email address format must be valid'
            }
        }
        return { valid: true, message: '' }
    },

    validatePassword: password => {
        if (!password) {
            return { valid: false, message: 'Password is required' }
        }
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{16,}$/
        if (!passwordRegex.test(password)) {
            return {
                valid: false,
                message: `Password must be at least 16 characters and 
                         include at least one lowercase letter, one capital 
                         letter, one number and one symbol (!@#$%^&*)`
            }
        }
        return { valid: true, message: '' }
    }
}

module.exports = validateUser
