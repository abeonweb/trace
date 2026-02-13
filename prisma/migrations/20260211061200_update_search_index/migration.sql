DROP INDEX IF EXISTS issues_search_idx;

CREATE INDEX issues_search_idx
ON issues
USING GIN (
  (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  )
);