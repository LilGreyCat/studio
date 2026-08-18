FROM golang:1.25-alpine AS builder

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/studio-api \
    ./cmd/api

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
