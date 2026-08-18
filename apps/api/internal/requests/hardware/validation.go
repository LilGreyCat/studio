package hardware

import (
	"errors"
	"net/url"
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/PtiCadri/studio/apps/api/internal/utils"
)

const (
	maxSlugLength        = 80
	maxEyebrowLength     = 80
	maxTitleLength       = 160
	maxDescriptionLength = 10000
	maxImageURLLength    = 2048
)

var slugPattern = regexp.MustCompile(`^[a-z0-9]+(-[a-z0-9]+)*$`)

func NormalizeCreate(request *Create) error {
	request.Slug = strings.TrimSpace(request.Slug)
	request.Eyebrow = strings.TrimSpace(request.Eyebrow)
	request.Title = strings.TrimSpace(request.Title)
	request.Description = strings.TrimSpace(request.Description)
	request.ImageURL = strings.TrimSpace(request.ImageURL)

	if err := validateTextFields(
		request.Slug,
		request.Eyebrow,
		request.Title,
		request.Description,
		request.ImageURL,
	); err != nil {
		return err
	}
	if err := validateDimensions(request.ImageWidth, request.ImageHeight); err != nil {
		return err
	}
	if request.DisplayOrder != nil && *request.DisplayOrder < 0 {
		return errors.New("display_order must be zero or greater")
	}
	return nil
}

func NormalizePatch(request *Patch) error {
	if !patchHasFields(request) {
		return errors.New("at least one field is required")
	}

	if err := normalizeOptionalString(&request.Slug, "slug"); err != nil {
		return err
	}
	if err := normalizeOptionalString(&request.Eyebrow, "eyebrow"); err != nil {
		return err
	}
	if err := normalizeOptionalString(&request.Title, "title"); err != nil {
		return err
	}
	if err := normalizeOptionalString(&request.Description, "description"); err != nil {
		return err
	}
	if err := normalizeOptionalString(&request.ImageURL, "image_url"); err != nil {
		return err
	}

	if request.Slug.Value != nil && (utf8.RuneCountInString(*request.Slug.Value) > maxSlugLength || !slugPattern.MatchString(*request.Slug.Value)) {
		return errors.New("slug must contain lowercase letters, numbers, and single hyphens only")
	}
	if request.Eyebrow.Value != nil && utf8.RuneCountInString(*request.Eyebrow.Value) > maxEyebrowLength {
		return errors.New("eyebrow must be at most 80 characters")
	}
	if request.Title.Value != nil && utf8.RuneCountInString(*request.Title.Value) > maxTitleLength {
		return errors.New("title must be at most 160 characters")
	}
	if request.Description.Value != nil && utf8.RuneCountInString(*request.Description.Value) > maxDescriptionLength {
		return errors.New("description must be at most 10000 characters")
	}
	if request.ImageURL.Value != nil {
		if err := validateImageURL(*request.ImageURL.Value); err != nil {
			return err
		}
	}
	if request.ImageWidth.Set && (request.ImageWidth.Value == nil || *request.ImageWidth.Value <= 0) {
		return errors.New("image_width must be greater than zero")
	}
	if request.ImageHeight.Set && (request.ImageHeight.Value == nil || *request.ImageHeight.Value <= 0) {
		return errors.New("image_height must be greater than zero")
	}
	if request.DisplayOrder.Set && (request.DisplayOrder.Value == nil || *request.DisplayOrder.Value < 0) {
		return errors.New("display_order must be zero or greater")
	}
	if request.IsVisible.Set && request.IsVisible.Value == nil {
		return errors.New("is_visible cannot be null")
	}
	return nil
}

func ValidateReorder(request Reorder) error {
	if len(request.IDs) == 0 {
		return errors.New("ids must contain every hardware item")
	}
	if len(request.IDs) > 32767 {
		return errors.New("too many hardware items")
	}
	seen := make(map[int64]struct{}, len(request.IDs))
	for _, id := range request.IDs {
		if id <= 0 {
			return errors.New("ids must contain positive identifiers")
		}
		if _, exists := seen[id]; exists {
			return errors.New("ids must not contain duplicates")
		}
		seen[id] = struct{}{}
	}
	return nil
}

func validateTextFields(slug, eyebrow, title, description, imageURL string) error {
	if slug == "" || !slugPattern.MatchString(slug) || utf8.RuneCountInString(slug) > maxSlugLength {
		return errors.New("slug must be 1-80 lowercase letters, numbers, or single hyphens")
	}
	if eyebrow == "" || utf8.RuneCountInString(eyebrow) > maxEyebrowLength {
		return errors.New("eyebrow must be 1-80 characters")
	}
	if title == "" || utf8.RuneCountInString(title) > maxTitleLength {
		return errors.New("title must be 1-160 characters")
	}
	if description == "" || utf8.RuneCountInString(description) > maxDescriptionLength {
		return errors.New("description must be 1-10000 characters")
	}
	return validateImageURL(imageURL)
}

func validateDimensions(width, height int16) error {
	if width <= 0 {
		return errors.New("image_width must be greater than zero")
	}
	if height <= 0 {
		return errors.New("image_height must be greater than zero")
	}
	return nil
}

func validateImageURL(value string) error {
	if value == "" || len(value) > maxImageURLLength {
		return errors.New("image_url must be 1-2048 characters")
	}
	parsed, err := url.ParseRequestURI(value)
	if err != nil || parsed.IsAbs() || parsed.Host != "" || parsed.RawQuery != "" || parsed.Fragment != "" {
		return errors.New("image_url must be a local image path")
	}
	if !strings.HasPrefix(parsed.Path, "/matos/") && !strings.HasPrefix(parsed.Path, "/uploads/") {
		return errors.New("image_url must point to /matos or /uploads")
	}
	if strings.Contains(parsed.Path, "..") {
		return errors.New("image_url must not contain path traversal")
	}
	return nil
}

func normalizeOptionalString(field *utils.Optional[string], name string) error {
	if !field.Set {
		return nil
	}
	if field.Value == nil {
		return errors.New(name + " cannot be null")
	}
	value := strings.TrimSpace(*field.Value)
	if value == "" {
		return errors.New(name + " cannot be empty")
	}
	field.Value = &value
	return nil
}

func patchHasFields(request *Patch) bool {
	return request.Slug.Set || request.Eyebrow.Set || request.Title.Set ||
		request.Description.Set || request.ImageURL.Set || request.ImageWidth.Set ||
		request.ImageHeight.Set || request.DisplayOrder.Set || request.IsVisible.Set
}
