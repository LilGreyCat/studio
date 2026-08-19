package project

import "errors"

func ValidateReorder(request Reorder) error {
	if len(request.IDs) == 0 {
		return errors.New("ids must contain every project")
	}
	if len(request.IDs) > 32767 {
		return errors.New("too many projects")
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
