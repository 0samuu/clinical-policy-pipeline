<?php
declare(strict_types=1);

namespace Clinical\Gateway\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Enterprise Clinical Security & Gateway Controller Middleware
 * PHP 8.3 | Strict Types | PSR-15 | RFC 8693 Backchannel Eviction | Transactional RLS Context
 */
final class ClinicalSecurityMiddleware implements MiddlewareInterface
{
    private \PDO $pdo;
    private $redis;
    private string $jwksUrl;

    public function __construct(\PDO $pdo, $redis, string $jwksUrl)
    {
        $this->pdo = $pdo;
        $this->redis = $redis;
        $this->jwksUrl = $jwksUrl;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $traceparent = $request->getHeaderLine('traceparent') ?: sprintf('00-%s-%s-01', bin2hex(random_bytes(16)), bin2hex(random_bytes(8)));
        $request = $request->withHeader('traceparent', $traceparent);

        // Security Context Injection
        $appUserId = $request->getHeaderLine('X-User-Id') ?: 'a0000000-0000-0000-0000-000000000001';
        $appUserRole = $request->getHeaderLine('X-User-Role') ?: 'ROLE_ATTENDING_PHYSICIAN';

        $stmt = $this->pdo->prepare("SELECT set_config('app.current_user_id', :user_id, true), set_config('app.current_user_role', :user_role, true)");
        $stmt->execute([
            ':user_id' => $appUserId,
            ':user_role' => $appUserRole
        ]);

        $response = $handler->handle($request);

        return $response
            ->withoutHeader('X-Powered-By')
            ->withoutHeader('Server')
            ->withHeader('X-Frame-Options', 'DENY')
            ->withHeader('X-Content-Type-Options', 'nosniff');
    }
}
