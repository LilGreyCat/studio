package main

import (
	"log"

	"github.com/PtiCadri/studio/apps/api/internal/config"
	"github.com/PtiCadri/studio/apps/api/internal/server"
	"github.com/PtiCadri/studio/apps/api/internal/storage"
)

func main() {
	cfg := config.Load()

	if err := cfg.ValidateAPI(); err != nil {
		log.Fatalf("invalid configuration: %v", err)
	}

	pg, err := storage.NewPostgres(cfg.DatabaseUrl)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pg.DB.Close()

	router := server.NewRouter(pg.DB, cfg)
	srv := server.New(":"+cfg.Port, router)

	log.Fatal(srv.Start())
}
