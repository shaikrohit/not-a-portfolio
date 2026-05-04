-- RPC function to edit a score, bypassing RLS
CREATE OR REPLACE FUNCTION edit_trivia_score_rpc(score_id UUID, new_username TEXT, new_score INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE trivia_scores
    SET username = new_username, score = new_score
    WHERE id = score_id;
    
    RETURN FOUND;
END;
$$;
