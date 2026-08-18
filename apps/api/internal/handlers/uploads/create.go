package uploads

import (
	"net/http"
	"strings"

	uploadResp "github.com/PtiCadri/studio/apps/api/internal/responses/uploads"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func (h Handler) Create(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 5<<20)

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "failed to parse multipart form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "file is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	folder := strings.TrimSpace(r.FormValue("folder"))
	if err := validateFolder(folder); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ext, err := validateFileExtension(header.Filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := validateFileMimeType(file, ext); err != nil {
		status := http.StatusBadRequest
		if err.Error() == "failed to read file" ||
			err.Error() == "failed to reset file reader" {
			status = http.StatusInternalServerError
		}

		http.Error(w, err.Error(), status)
		return
	}

	filename, err := saveUploadedFile(file, folder, ext)
	if err != nil {
		http.Error(w, "failed to save file", http.StatusInternalServerError)
		return
	}

	response := uploadResp.UploadResponse{
		URL: "/uploads/" + folder + "/" + filename,
	}

	utils.WriteJSON(w, http.StatusCreated, response)
}
