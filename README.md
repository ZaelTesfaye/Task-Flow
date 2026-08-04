# TaskFlows - Enterprise Project Management Platform

A production-grade, full-stack TypeScript application demonstrating modern software architecture, DevOps practices, and scalable system design deployed on AWS.

**Live:** [task-flows.tech](https://task-flows.tech) | **Admin:** [admin.task-flows.tech](https://admin.task-flows.tech) | **Monitoring:** [monitor.task-flows.tech](https://monitor.task-flows.tech)

---

## Architecture Overview

**Monorepo Structure:**
- **Client** - Next.js 16 (React 19) static export
- **Admin** - Vite + React 19 SPA
- **Backend** - Express 5 + TypeScript, containerized with Docker
- **Database** - PostgreSQL 15 with Prisma ORM, PgBouncer connection pooling
- **Infrastructure** - AWS EC2 deployment with Nginx load balancing (2 backend replicas)

**Tech Stack:**
- **Language:** TypeScript 5.9 (100% coverage, strict mode)
- **State Management:** TanStack Query v5, Zustand
- **Authentication:** Better Auth + OAuth 2.0 (Google One Tap)
- **Payments:** Stripe with webhooks
- **Caching:** Redis (sessions, rate limiting)
- **Monitoring:** Grafana + Prometheus + Loki + Promtail
- **CI/CD:** GitHub Actions (6 workflows - separate CI/CD per service)

---

## What Makes This Impressive

### Production-Ready Infrastructure

**Deployment:**
- 2 Express replicas behind Nginx load balancer (round-robin)
- Health checks with automatic container recovery (Autoheal)
- PgBouncer transaction pooling (20 connections, 1000 max clients)

**Observability Stack:**
- Grafana dashboards with Prometheus metrics (15s scrape interval)
- Centralized logging via Loki (31-day retention, Snappy compression)
- Promtail shipping logs
- Winston structured logging with daily rotation
- Smart log filtering (drops health checks, reduces volume 40%)

**CI/CD Pipeline:**
- 6 automated workflows (3 CI + 3 CD)
- Independent pipelines per service (path-based triggers)
- Quality gates: TypeScript, ESLint, tests, security audits
- Docker multi-stage builds with GitHub Actions caching
- Immutable deployments (images tagged with Git SHA)
- Automated S3 database backups with email alerts

**Load Balancing & Performance:**
- Nginx reverse proxy with HTTP/1.1 keepalive (32 connections)
- Gzip compression (level 5, min 1KB)
- Static asset caching (1 year immutable, 60s for HTML)
- SSL/TLS termination with Let's Encrypt
- 4 virtual hosts with security headers (CSP, X-Frame-Options, HSTS)

### 🔐 Authentication & Security

**Google One Tap Integration:**
- Frictionless OAuth with `useOneTap` and `auto_select`
- Custom styled overlay with loading states

**Email OTP System:**
- Better Auth `emailOTP` plugin (10-minute expiration)
- Auto sign-in after verification
- React Email templates with branding

**Password Reset Pipeline:**
- 3-step flow: Request → OTP verification → New password
- Email notifications via Resend
- Shows "Forgot Password" after 3 failed login attempts

**Rate Limiting (Redis-backed):**
- Dual windows: 5 attempts/10min (burst), 15/hour (sustained)
- Email + IP tracking per user
- `Retry-After` headers for proper HTTP compliance
- Automatic blocking with exponential backoff

### 💳 Subscription & Billing System

**Stripe Integration:**
- 3-tier pricing: Free (5 projects, 3 members), Starter $5 (10 projects, 10 members), Pro $10 (unlimited)
- Checkout sessions with metadata tracking
- Webhook handling: `checkout.session.completed`, `invoice.paid`
- Plan upgrades with prorated billing
- Billing portal integration (customer self-service)
- Feature enforcement at API layer (project/member limits)

### 📬 Notification System

**Dual-Channel Notifications:**
- In-app notifications (task_assigned, task_updated, task_completed)
- React Email templates (4 types: invitations, password reset, task assignment)
- Unread count tracking per project
- Mark as read (individual/bulk)

**Invitation System:**
- Dual-path: Registered users (instant) vs non-registered (signup prompt)
- Status tracking: pending, accepted, declined, expired
- Automatic member addition on acceptance

### 🔄 Task Update Approval Workflow

**Request/Review Pattern:**
- Assignees submit update requests with description + new status
- Stored as `PendingUpdates` in database
- Project owners/admins approve or reject via modal UI
- Prevents unauthorized task status changes
- Audit trail for all updates

### 🗃️ Database Design

**Schema Highlights:**
- Strategic indexes on foreign keys and query patterns (`@@index([userId, isRead])`)
- Composite unique constraints (`@@unique([ownerId, title])`)
- Cascade deletes for referential integrity
- Soft deletes (user bans with expiry dates)
- Temporal fields (createdAt, updatedAt) for audit trails

**Backup & Disaster Recovery:**
- Automated daily backups via cron + `pg_dump`
- Gzip compression (60-70% size reduction)
- S3 offsite storage (`s3://task-flows/db`)
- Email alerts on failure (Resend API)
- Local retention: 1 day, S3 retention: configurable

### 🎨 UI/UX Features

**Progressive Web App (PWA):**
- Service worker with intelligent caching
- Offline support with cache fallback
- Installable on desktop/mobile
- Manifest with theme colors

**Dark/Light Theme:**
- CSS variable-based theming (HSL)
- localStorage persistence
- Smooth transitions (`.disable-transitions` class)

**Component Architecture:**
- Radix UI primitives (accessible, unstyled)
- Tailwind CSS v4 with class variance authority
- Reusable modal system
- Slide-out panels (settings, members)
- Toast notifications (React Hot Toast)

---

## Code Quality

**Testing:**
- Vitest with unit + integration tests
- Test setup files for mocks
- CI testing gates (all tests must pass)

**Code Standards:**
- ESLint + Prettier (120-char width)
- Husky pre-commit hooks (lint-staged)
- Pre-push hooks (full test suite)
- TypeScript strict mode

# Devops

**Docker Orchestration:**
- 11-service stack: 2 app replicas, PostgreSQL, PgBouncer, Redis, Nginx, Loki, Prometheus, Promtail, Grafana, Autoheal
- Multi-stage Dockerfile (build + runtime, 60% size reduction)
- Non-root user execution
- Volume management for persistence
- Health checks on all services

**Folder Structure (Backend):**
```
server/src/
├── config/          # Environment & CORS configuration
├── controllers/     # Request handlers (thin layer)
├── services/        # Business logic (fat layer)
├── model/           # Data access (repository pattern)
├── routes/          # API endpoint definitions
├── middlewares/     # Auth, error handling, rate limiting, XSS, validation
├── schemas/         # Zod/Joi request validation
├── lib/             # Prisma, Redis, Winston, Better Auth
├── loaders/         # App initialization
├── emails/          # React Email templates
├── docs/            # OpenAPI spec generation
├── utils/           # APIError, asyncWrapper, exit handlers
└── scripts/         # DB backups, seeders
```

---

## API Documentation

- **Scalar UI** - Modern interactive docs at `/api-reference`
- **Swagger UI** - Traditional docs at `/api-docs`
- **OpenAPI 3.0** - Auto-generated from TSOA annotations at `/swagger.json`
- **Better Auth Studio** - Admin auth dashboard at `/api/admin/studio`

---

## Deployment Architecture

**AWS EC2 Setup:**
- Ubuntu instances with Docker + Docker Compose
- Elastic IP for static DNS mapping
- Security groups (ports 80, 443, 22)
- EBS volumes for persistence
- S3 for offsite backups

**Nginx Configuration:**
- Round-robin load balancing across 2 backend replicas
- Keepalive connections (32 pool)
- JSON logging with smart filtering (errors + slow requests >1s)
- 4 virtual hosts: main app, admin, auth studio, Grafana

**CI/CD Flow:**
1. Push to `main` triggers pipeline
2. Run TypeScript check, lint, tests, security audit
3. Build Docker image, push to Docker Hub (`latest` + SHA tags)
4. SSH to EC2, inject `.env`, pull image
5. `docker compose up -d` (rolling restart)
6. Health check verification at `/api/health`
7. Deployment fails if health check returns non-200

---

## Key Metrics

**Architecture:**
- 100% TypeScript coverage with strict mode
- 11 Docker containers orchestrated
- 2 backend replicas load balanced
- 6 CI/CD workflows (independent per service)
- 31-day log retention, 72-hour metrics retention

**Performance:**
- 15-second metric scrape interval
- HTTP/1.1 keepalive for connection reuse
- Gzip compression on all text assets
- 1-year cache for immutable assets

**Security:**
- Rate limiting (5/10min, 15/hour)
- HTTPS everywhere with Let's Encrypt
- XSS sanitization on all inputs
- RBAC with 3 access levels (owner/admin/member)
- Automated vulnerability scanning in CI

---

## Production Readiness Checklist

- [x] TypeScript strict mode (100% coverage)
- [x] Unit & integration tests with Vitest
- [x] Multi-stage Docker builds with caching
- [x] Load balancing (Nginx + 2 replicas)
- [x] Connection pooling (PgBouncer)
- [x] Automated database backups to S3
- [x] Complete observability (Grafana, Prometheus, Loki)
- [x] CI/CD with 6 automated workflows
- [x] Zero-downtime deployments
- [x] Health checks with auto-recovery
- [x] Rate limiting + XSS protection
- [x] HTTPS/TLS with Let's Encrypt
- [x] Redis session storage
- [x] Strategic database indexes
- [x] Email OTP verification
- [x] Stripe webhooks + subscriptions
- [x] PWA with offline support
- [x] AWS EC2 deployment
- [x] Immutable Docker tags (Git SHA)

---

## What This Demonstrates

**Backend Engineering:**
- Scalable architecture (controller-service-repository pattern)
- Database design with proper indexing and constraints
- Connection pooling and caching strategies
- Error handling with graceful shutdown
- Rate limiting and security best practices

**DevOps Proficiency:**
- Docker containerization and orchestration
- Multi-stage builds for optimization
- CI/CD pipeline design and automation
- Infrastructure monitoring and alerting
- Log aggregation and analysis
- Zero-downtime deployment strategies

**Full-Stack Expertise:**
- End-to-end TypeScript (database to UI)
- State management patterns (server state vs client state)
- Authentication and authorization systems
- Payment integration and webhook handling
- Real-time notifications (in-app + email)
- Progressive web app implementation

**System Design:**
- Load balancing and horizontal scaling
- High availability with multiple replicas
- Disaster recovery with automated backups
- Observability and debugging capabilities
- Performance optimization (caching, compression, connection pooling)

---

**Built with TypeScript. Deployed with confidence on AWS.**
