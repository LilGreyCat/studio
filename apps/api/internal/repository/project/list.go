package project

import (
	"context"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) List(
	ctx context.Context,
) ([]models.ProjectOverview, error) {
	const query = `
		SELECT
			p.id, p.name, p.image_url, p.created_at, p.updated_at,
			p.id, pl.spotify_url, pl.deezer_url, pl.apple_music_url,
			pl.soundcloud_url, pl.youtube_url,
			p.id, pi.spotify_embed_url, pi.deezer_embed_url, pi.apple_music_embed_url
		FROM projects AS p
		LEFT JOIN project_links AS pl ON pl.project_id = p.id
		LEFT JOIN project_integrations AS pi ON pi.project_id = p.id
		ORDER BY p.id DESC;
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := make([]models.ProjectOverview, 0)

	for rows.Next() {
		var project models.ProjectOverview

		err := rows.Scan(
			&project.Project.ID,
			&project.Project.Name,
			&project.Project.ImageURL,
			&project.Project.CreatedAt,
			&project.Project.UpdatedAt,
			&project.Links.ProjectID,
			&project.Links.SpotifyURL,
			&project.Links.DeezerURL,
			&project.Links.AppleMusicURL,
			&project.Links.SoundcloudURL,
			&project.Links.YoutubeURL,
			&project.Integrations.ProjectID,
			&project.Integrations.SpotifyEmbedURL,
			&project.Integrations.DeezerEmbedURL,
			&project.Integrations.AppleMusicEmbedURL,
		)
		if err != nil {
			return nil, err
		}

		projects = append(projects, project)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return projects, nil
}
