-- RPC function to approve a score, bypassing RLS
CREATE OR REPLACE FUNCTION approve_trivia_score_rpc(score_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE trivia_scores
    SET is_approved = true
    WHERE id = score_id;
    
    RETURN FOUND;
END;
$$;

-- RPC function to decline (delete) a score, bypassing RLS
CREATE OR REPLACE FUNCTION decline_trivia_score_rpc(score_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM trivia_scores
    WHERE id = score_id;
    
    RETURN FOUND;
END;
$$;
