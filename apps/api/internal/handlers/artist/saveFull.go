package artist

import (
	"net/http"

	"github.com/PtiCadri/studio/apps/api/internal/httpapi"
	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
	artistResp "github.com/PtiCadri/studio/apps/api/internal/responses/artist"
	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

func normalizeFullArtistURLs(links *artistReq.PutLinks, integrations *artistReq.PutIntegrations) error {
	if err := utils.NormalizeHTTPURLs(&links.SpotifyURL, &links.DeezerURL,
		&links.AppleMusicURL, &links.SoundcloudURL, &links.YoutubeURL,
		&links.InstagramURL, &links.TiktokURL); err != nil {
		return err
	}
	return utils.NormalizeEmbedURLs(&integrations.SpotifyEmbedURL,
		&integrations.DeezerEmbedURL, &integrations.AppleMusicEmbedURL)
}

func (h Handler) CreateFull(w http.ResponseWriter, r *http.Request) {
	var request artistReq.CreateFullArtist
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	name, err := utils.NormalizeEntityName(request.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	request.Name = name
	if err := normalizeFullArtistURLs(&request.Links, &request.Integrations); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	artist, err := h.artistRepo.CreateFull(r.Context(), request)
	if err != nil {
		http.Error(w, "failed to create artist", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, artistResp.ToArtistResponse(artist))
}

func (h Handler) UpdateFull(w http.ResponseWriter, r *http.Request) {
	id, ok := httpapi.ParseID(w, r, "id", "artist")
	if !ok {
		return
	}
	var request artistReq.UpdateFullArtist
	if !httpapi.DecodeJSON(w, r, &request) {
		return
	}
	if request.Artist.Name.Set && request.Artist.Name.Value == nil {
		http.Error(w, "name cannot be null", http.StatusBadRequest)
		return
	}
	if !request.Artist.Name.Set && !request.Artist.ImageURL.Set &&
		!request.Artist.DisplayOrder.Set && !request.Artist.IsVisible.Set {
		http.Error(w, "at least one artist field is required", http.StatusBadRequest)
		return
	}
	if request.Artist.Name.Value != nil {
		name, err := utils.NormalizeEntityName(*request.Artist.Name.Value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		request.Artist.Name.Value = &name
	}
	if request.Artist.DisplayOrder.Set && (request.Artist.DisplayOrder.Value == nil || *request.Artist.DisplayOrder.Value < 0) {
		http.Error(w, "display_order must be zero or greater", http.StatusBadRequest)
		return
	}
	if request.Artist.IsVisible.Set && request.Artist.IsVisible.Value == nil {
		http.Error(w, "is_visible cannot be null", http.StatusBadRequest)
		return
	}
	if err := normalizeFullArtistURLs(&request.Links, &request.Integrations); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	artist, err := h.artistRepo.UpdateFull(r.Context(), id, request)
	if err != nil {
		httpapi.WriteRepositoryError(w, err, "artist not found", "failed to update artist")
		return
	}
	utils.WriteJSON(w, http.StatusOK, artistResp.ToArtistResponse(artist))
}
