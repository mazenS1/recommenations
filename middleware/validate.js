const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const userValidationRules = [
    body('email').isEmail().normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/),
    body('name').trim().isLength({ min: 2, max: 100 })
];

module.exports = {
    validate,
    userValidationRules
};
