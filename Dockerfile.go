FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY backend/go/go.mod backend/go/go.sum ./
RUN go mod download

COPY backend/go .
COPY .env . 

RUN CGO_ENABLED=0 GOOS=linux go build -o myapp ./cmd/server/main.go

FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/myapp .
COPY --from=builder /app/.env .

EXPOSE 3030
CMD ["./myapp"]