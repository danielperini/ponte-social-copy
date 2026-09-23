<?php
declare(strict_types=1);

function reply(int $status, array $data): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}
function reject(int $status, string $message): never { reply($status, ['message' => $message]); }
function sameSitePath(mixed $value): string {
    // Return only known public routes: no arbitrary URLs, query tokens or API loops.
    return is_string($value) && preg_match('~^/(?:conta/excluir|artigos/[a-z0-9-]+)?$~D', $value) ? $value : '/';
}
function googleReady(array $cfg): bool {
    $g = $cfg['google'];
    return $g['enabled'] === true && $g['client_id'] !== '' && $g['client_secret'] !== ''
        && filter_var($g['admin_email'], FILTER_VALIDATE_EMAIL) !== false;
}
function rateLimit(array $cfg, string $bucket, int $limit): void {
    if (strlen($cfg['rate_key']) < 32) reject(503, 'Serviço ainda não configurado.');
    // Fixed-size map, exclusive lock: limits survive session/cookie rotation.
    $file = fopen(__DIR__ . '/var/rate.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) throw new RuntimeException('Rate storage unavailable');
    $rows = json_decode(stream_get_contents($file) ?: '{}', true, 16, JSON_THROW_ON_ERROR);
    $now = time();
    $rows = array_filter($rows, fn($v) => $v['until'] > $now);
    $key = hash_hmac('sha256', $bucket . ':' . ($_SERVER['REMOTE_ADDR'] ?? ''), $cfg['rate_key']);
    $global = 'global-' . $bucket;
    foreach ([$key => $limit, $global => $limit * 20] as $k => $max) {
        $rows[$k] ??= ['count' => 0, 'until' => $now + 3600];
        if ($rows[$k]['count'] >= $max) {
            flock($file, LOCK_UN); fclose($file);
            header('Retry-After: 3600'); reject(429, 'Tente novamente mais tarde.');
        }
    }
    $rows[$key]['count']++; $rows[$global]['count']++;
    rewind($file); ftruncate($file, 0);
    fwrite($file, json_encode($rows, JSON_THROW_ON_ERROR)); fflush($file);
    flock($file, LOCK_UN); fclose($file);
}
function googleRequest(string $url, ?array $form = null, ?string $token = null): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_FOLLOWLOCATION => false]);
    if ($form !== null) curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query($form)]);
    if ($token !== null) curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $token]);
    $result = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($result === false || $status !== 200) throw new RuntimeException('Identity provider unavailable');
    return json_decode($result, true, 32, JSON_THROW_ON_ERROR);
}
function sendDeletion(array $cfg, string $email, bool $local): void {
    if ($cfg['mail_mode'] === 'test' && $cfg['environment'] === 'test' && $local) {
        // No network or PII output in local endpoint tests.
        file_put_contents(__DIR__ . '/var/test-mail-count', "accepted\n", FILE_APPEND | LOCK_EX);
        return;
    }
    $smtp = $cfg['smtp'];
    $recipient = $cfg['environment'] === 'production' ? $smtp['recipient'] : $smtp['staging_recipient'];
    if ($cfg['mail_mode'] !== 'smtp' || !$smtp['host'] || !$smtp['username'] || !$smtp['password']
        || !filter_var($smtp['from'], FILTER_VALIDATE_EMAIL) || !filter_var($recipient, FILTER_VALIDATE_EMAIL)
        || !in_array($smtp['encryption'], ['ssl', 'tls'], true)) reject(503, 'Envio ainda não configurado.');
    require_once __DIR__ . '/vendor/autoload.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP(); $mail->SMTPDebug = 0; $mail->Timeout = 15;
    $mail->Host = $smtp['host']; $mail->Port = (int)$smtp['port'];
    $mail->SMTPAuth = true; $mail->Username = $smtp['username']; $mail->Password = $smtp['password'];
    $mail->SMTPSecure = $smtp['encryption'];
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($smtp['from'], 'Ponte Social');
    $mail->addAddress($recipient);
    $mail->Subject = 'Solicitação de exclusão de conta/dados — Ponte Social';
    $mail->Body = "Solicitação manual de exclusão de conta/dados\nE-mail informado: {$email}\n\n"
        . 'O solicitante confirmou compreender as consequências. Verificar identidade e escopo antes de qualquer exclusão. Nenhum dado foi apagado automaticamente.';
    $mail->send();
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
ini_set('display_errors', '0');
ini_set('log_errors', '0'); // No provider responses, credentials or PII in PHP error logs.
set_error_handler(function () { throw new RuntimeException('Internal failure'); });
try {
    if (!is_file(__DIR__ . '/config.php')) reject(503, 'Serviço ainda não configurado.');
    $cfg = require __DIR__ . '/config.php';
    $local = $cfg['allow_local_http'] === true
        && in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)
        && in_array($cfg['origin'], ['http://127.0.0.1:8080', 'http://localhost:8080'], true);
    if (!$local && (($_SERVER['HTTPS'] ?? '') !== 'on')) reject(400, 'HTTPS obrigatório.');
    if (!is_dir(__DIR__ . '/var')) mkdir(__DIR__ . '/var', 0700, true);
    if (!is_dir(__DIR__ . '/var/sessions')) mkdir(__DIR__ . '/var/sessions', 0700, true);
    ini_set('session.use_strict_mode', '1'); ini_set('session.use_only_cookies', '1');
    session_save_path(__DIR__ . '/var/sessions');
    session_name($local ? 'ponte_session' : '__Host-ponte_session');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => !$local, 'httponly' => true, 'samesite' => 'Lax']);
    session_start();
    $now = time();
    if (isset($_SESSION['user'])) {
        $u = $_SESSION['user']; $g = $cfg['google'];
        if (!googleReady($cfg) || ($_SESSION['expires'] ?? 0) < $now || ($_SESSION['last_seen'] ?? 0) < $now - 1800
            || strcasecmp($u['email'], $g['admin_email']) !== 0 || ($g['admin_sub'] !== '' && $u['id'] !== $g['admin_sub'])) {
            $_SESSION = []; session_regenerate_id(true);
        } else { $_SESSION['last_seen'] = $now; }
    }
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    $action = $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];
    $gets = ['session', 'me', 'google-start', 'google-callback'];
    $posts = ['logout', 'deletion', 'contact'];
    if (!in_array($action, [...$gets, ...$posts], true)) reject(404, 'Endpoint não encontrado.');
    $expected = in_array($action, $gets, true) ? 'GET' : 'POST';
    if ($method !== $expected) { header('Allow: ' . $expected); reject(405, 'Método inválido.'); }
    if ($method === 'POST') {
        if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $cfg['origin']
            || !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) reject(403, 'Requisição não autorizada.');
        if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') reject(415, 'JSON obrigatório.');
        $raw = file_get_contents('php://input', false, null, 0, 4097);
        if (strlen($raw) > 4096) reject(413, 'Requisição muito grande.');
        try { $body = json_decode($raw, true, 8, JSON_THROW_ON_ERROR); }
        catch (JsonException) { reject(400, 'JSON inválido.'); }
        if (!is_array($body)) reject(400, 'JSON inválido.');
    }
    if ($action === 'session') reply(200, ['csrf' => $_SESSION['csrf'], 'user' => $_SESSION['user'] ?? null,
        'settings' => ['public_settings' => ['auth_required' => false], 'google_enabled' => googleReady($cfg)]]);
    if ($action === 'me') {
        if (!isset($_SESSION['user'])) reject(401, 'Sessão ausente.');
        reply(200, $_SESSION['user']);
    }
    if ($action === 'logout') {
        $_SESSION = []; session_destroy();
        setcookie(session_name(), '', ['expires' => 1, 'path' => '/', 'secure' => !$local, 'httponly' => true, 'samesite' => 'Lax']);
        reply(200, ['ok' => true]);
    }
    if ($action === 'contact') reject(404, 'Formulário comercial não habilitado.');
    if ($action === 'deletion') {
        $email = $body['email'] ?? null;
        if (!is_string($email) || strlen($email) > 254 || preg_match('/[\r\n]/', $email)
            || !filter_var($email, FILTER_VALIDATE_EMAIL) || ($body['confirmed'] ?? false) !== true) reject(422, 'Confirme e informe um e-mail válido.');
        rateLimit($cfg, 'deletion', 5);
        sendDeletion($cfg, $email, $local);
        reply(202, ['accepted' => true]);
    }
    if (!googleReady($cfg)) reject(503, 'Login ainda não configurado.');
    $g = $cfg['google'];
    $callback = $cfg['origin'] . '/api/index.php?action=google-callback';
    if ($action === 'google-start') {
        rateLimit($cfg, 'login', 20);
        $state = bin2hex(random_bytes(32));
        $verifier = bin2hex(random_bytes(32));
        $_SESSION['oauth'] = ['state' => $state, 'verifier' => $verifier, 'expires' => $now + 600,
            'return' => sameSitePath($_GET['returnTo'] ?? '/')];
        $query = http_build_query(['client_id' => $g['client_id'], 'redirect_uri' => $callback,
            'response_type' => 'code', 'scope' => 'openid email', 'state' => $state,
            'code_challenge' => rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '='),
            'code_challenge_method' => 'S256', 'prompt' => 'select_account']);
        header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $query, true, 302); exit;
    }
    $oauth = $_SESSION['oauth'] ?? null;
    unset($_SESSION['oauth']); // Single-use state even on rejection/cancellation.
    if (!$oauth || $oauth['expires'] < $now || !is_string($_GET['state'] ?? null)
        || !hash_equals($oauth['state'], $_GET['state']) || !is_string($_GET['code'] ?? null)
        || strlen($_GET['code']) > 4096 || isset($_GET['error'])) reject(400, 'Login inválido ou expirado. Volte ao login.');
    $tokens = googleRequest('https://oauth2.googleapis.com/token', ['client_id' => $g['client_id'],
        'client_secret' => $g['client_secret'], 'redirect_uri' => $callback, 'grant_type' => 'authorization_code',
        'code' => $_GET['code'], 'code_verifier' => $oauth['verifier']]);
    if (!is_string($tokens['access_token'] ?? null)) throw new RuntimeException('Invalid token response');
    // Identity is obtained directly from Google's HTTPS UserInfo endpoint with the
    // server-exchanged token. Never trust identity/id_token supplied by a browser.
    $identity = googleRequest('https://openidconnect.googleapis.com/v1/userinfo', null, $tokens['access_token']);
    unset($tokens);
    if (($identity['email_verified'] ?? false) !== true || !is_string($identity['email'] ?? null)
        || !is_string($identity['sub'] ?? null) || $identity['sub'] === ''
        || strcasecmp($identity['email'], $g['admin_email']) !== 0
        || ($g['admin_sub'] !== '' && $identity['sub'] !== $g['admin_sub'])) reject(403, 'Conta não autorizada.');
    session_regenerate_id(true);
    $_SESSION = ['user' => ['id' => $identity['sub'], 'email' => $identity['email'], 'role' => 'admin'],
        'csrf' => bin2hex(random_bytes(32)), 'expires' => $now + 28800, 'last_seen' => $now];
    header('Location: ' . $oauth['return'], true, 303); exit;
} catch (Throwable) {
    reject(503, 'Serviço temporariamente indisponível.');
}
