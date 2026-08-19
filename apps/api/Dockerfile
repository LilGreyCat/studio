FROM golang:1.25-alpine AS builder

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/studio-api \
    ./cmd/api \
    && CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/create-admin \
    ./cmd/create-admin \
    && CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/cleanup-uploads \
    ./cmd/cleanup-uploads

FROM golang:1.25-alpine AS migration-builder

RUN CGO_ENABLED=0 go install -tags "postgres file" \
    github.com/golang-migrate/migrate/v4/cmd/migrate@v4.19.1

FROM alpine:3.22 AS migrator

RUN apk add --no-cache ca-certificates \
    && addgroup -S migrate \
    && adduser -S -G migrate migrate

WORKDIR /app

COPY --from=migration-builder /go/bin/migrate /usr/local/bin/migrate
COPY --chown=migrate:migrate migrations ./migrations

USER migrate

ENTRYPOINT ["migrate"]

FROM alpine:3.22 AS admin-cli

RUN apk add --no-cache ca-certificates \
    && addgroup -S studio \
    && adduser -S -G studio studio

WORKDIR /app

COPY --from=builder --chown=studio:studio /out/create-admin ./create-admin

USER studio

ENTRYPOINT ["./create-admin"]

FROM alpine:3.22 AS upload-cleaner

RUN apk add --no-cache ca-certificates \
    && addgroup -S studio \
    && adduser -S -G studio studio \
    && mkdir -p /app/uploads \
    && chown -R studio:studio /app

WORKDIR /app

COPY --from=builder --chown=studio:studio /out/cleanup-uploads ./cleanup-uploads

USER studio

ENTRYPOINT ["./cleanup-uploads"]

FROM alpine:3.22 AS runner

RUN apk add --no-cache ca-certificates tzdata \
    && addgroup -S studio \
    && adduser -S -G studio studio \
    && mkdir -p /app/uploads \
    && chown -R studio:studio /app

WORKDIR /app

COPY --from=builder --chown=studio:studio /out/studio-api ./studio-api

USER studio

EXPOSE 8080

ENTRYPOINT ["./studio-api"]
