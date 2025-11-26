require('dotenv').config({ path: '../.env' });

const required = [
    'MOMO_PARTNER_CODE',
    'MOMO_ACCESS_KEY',
    'MOMO_SECRET_KEY',
    'MOMO_API_ENDPOINT',
    'MOMO_IPN_URL'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.log("Missing environment variables:", missing.join(', '));
} else {
    console.log("All required MoMo environment variables are set.");
}
