package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/PtiCadri/studio/apps/api/internal/config"
	"github.com/PtiCadri/studio/apps/api/internal/server"
	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

const shutdownTimeout = 30 * time.Second

func main() {
	if err := run(); err != nil {
		log.Printf("API stopped with an error: %v", err)
		os.Exit(1)
	}
}

func run() error {
	cfg := config.Load()

	if err := cfg.ValidateAPI(); err != nil {
		return fmt.Errorf("invalid configuration: %w", err)
	}

	pg, err := storage.NewPostgres(cfg.DatabaseUrl)
	if err != nil {
		return fmt.Errorf("connect to database: %w", err)
	}
	defer pg.DB.Close()

	router := server.NewRouter(pg.DB, cfg)
	srv := server.New(":"+cfg.Port, router)

	serverErrors := make(chan error, 1)
	go func() {
		serverErrors <- srv.Start()
	}()

	signalContext, stopSignals := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stopSignals()

	select {
	case err := <-serverErrors:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return fmt.Errorf("serve API: %w", err)
	case <-signalContext.Done():
		log.Print("API shutdown requested")
	}

	shutdownContext, cancelShutdown := context.WithTimeout(
		context.Background(),
		shutdownTimeout,
	)
	defer cancelShutdown()

	if err := srv.Shutdown(shutdownContext); err != nil {
		return fmt.Errorf("graceful shutdown: %w", err)
	}

	if err := <-serverErrors; err != nil && !errors.Is(err, http.ErrServerClosed) {
		return fmt.Errorf("serve API during shutdown: %w", err)
	}

	log.Print("API shutdown complete")
	return nil
}
