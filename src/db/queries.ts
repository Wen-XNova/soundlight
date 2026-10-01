export const QUERY_EXCERPTS_BY_TRACK = `
  SELECT 
    e.id, e.track_id, e.start_time_ms, e.end_time_ms, e.note, e.created_at,
    COALESCE(
      JSON_GROUP_ARRAY(
        JSON_OBJECT('id', t.id, 'name', t.name, 'colorHex', t.color_hex)
      ) FILTER (WHERE t.id IS NOT NULL), '[]'
    ) AS tags
  FROM excerpts e
  LEFT JOIN excerpt_tags et ON e.id = et.excerpt_id
  LEFT JOIN tags t ON et.tag_id = t.id
  WHERE e.track_id = ?
  GROUP BY e.id
  ORDER BY e.start_time_ms ASC;
`;