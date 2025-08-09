import pytest
from unittest.mock import Mock, patch
from app.services.score_service import save_or_update_score, get_leaderboard


class TestScoreService:
    @patch("app.services.score_service.db")
    def test_save_or_update_score_new_user(self, mock_db):
        # Mock empty query result (new user)
        mock_query = Mock()
        mock_query.stream.return_value = []
        mock_db.collection.return_value.where.return_value.where.return_value.limit.return_value = mock_query
        
        # Mock add method
        mock_add = Mock()
        mock_db.collection.return_value.add = mock_add
        
        save_or_update_score("user123", "reaction", 150, 5000)
        
        # Verify new score was added
        mock_add.assert_called_once()
        call_args = mock_add.call_args[0][0]
        assert call_args["uid"] == "user123"
        assert call_args["gameId"] == "reaction"
        assert call_args["score"] == 150
        assert call_args["runTimeMs"] == 5000

    @patch("app.services.score_service.db")
    def test_save_or_update_score_better_score(self, mock_db):
        # Mock existing document with worse score
        mock_doc = Mock()
        mock_doc.to_dict.return_value = {"score": 200}
        mock_query = Mock()
        mock_query.stream.return_value = [mock_doc]
        mock_db.collection.return_value.where.return_value.where.return_value.limit.return_value = mock_query
        
        save_or_update_score("user123", "reaction", 150, 5000)
        
        # Verify score was updated (better score for reaction = lower)
        mock_doc.reference.update.assert_called_once()
        update_data = mock_doc.reference.update.call_args[0][0]
        assert update_data["score"] == 150

    @patch("app.services.score_service.db")
    def test_get_leaderboard_reaction_ascending(self, mock_db):
        # Mock query and documents
        mock_query = Mock()
        mock_db.collection.return_value.where.return_value.order_by.return_value.order_by.return_value.limit.return_value = mock_query
        
        mock_doc1 = Mock()
        mock_doc1.to_dict.return_value = {"score": 150, "createdAt": "2024-01-01T10:00:00"}
        mock_doc1.id = "doc1"
        
        mock_doc2 = Mock()
        mock_doc2.to_dict.return_value = {"score": 200, "createdAt": "2024-01-01T11:00:00"}
        mock_doc2.id = "doc2"
        
        mock_query.stream.return_value = [mock_doc1, mock_doc2]
        
        items, next_cursor = get_leaderboard("reaction", 2)
        
        assert len(items) == 2
        assert items[0]["score"] == 150  # Lower score first for reaction
        assert items[1]["score"] == 200
        assert next_cursor is None  # Only 2 items, no next page
