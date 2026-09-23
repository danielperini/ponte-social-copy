<?php
// Copy to private/config.php OUTSIDE public_html. Never commit populated values.
return [
    'origin' => 'https://homologacao.example.invalid',
    'environment' => 'staging',
    'allow_local_http' => false,
    'rate_key' => '', // Generate locally: php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
    'mail_mode' => 'disabled', // disabled | smtp | test (test only on localhost)
    'smtp' => [
        'host' => '', 'port' => 465, 'encryption' => 'ssl',
        'username' => '', 'password' => '', 'from' => '',
        'recipient' => '', // Fixed operator mailbox; never accepted from frontend.
        'staging_recipient' => '', // A mailbox owned by the tester; mandatory in staging.
    ],
    'google' => [
        'enabled' => false, 'client_id' => '', 'client_secret' => '',
        // Explicit allowlist for the single administrator. No automatic sign-up.
        'admin_email' => '', 'admin_sub' => '', // sub optional initially; pin after reconciliation.
    ],
];
