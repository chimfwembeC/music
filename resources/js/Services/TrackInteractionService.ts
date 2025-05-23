import axios from 'axios';

/**
 * Service for handling track interactions like views, likes, downloads, etc.
 */
class TrackInteractionService {
  /**
   * Record a view for a track
   * @param trackId The ID of the track
   * @param duration Optional duration in seconds
   * @returns Promise with view data
   */
  async recordView(trackId: number, duration?: number) {
    try {
      const response = await axios.post(`/tracks/${trackId}/view`, {
        duration: duration || 0
      });
      return response.data.data;
    } catch (error) {
      console.error('Error recording view:', error);
      throw error;
    }
  }

  /**
   * Update view duration for a track
   * @param trackId The ID of the track
   * @param viewId The ID of the view to update
   * @param duration Duration in seconds
   * @returns Promise with updated view data
   */
  async updateViewDuration(trackId: number, viewId: number, duration: number) {
    try {
      const response = await axios.put(`/tracks/${trackId}/view-duration`, {
        view_id: viewId,
        duration
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating view duration:', error);
      throw error;
    }
  }

  /**
   * Toggle like for a track
   * @param trackId The ID of the track
   * @returns Promise with like data
   */
  async toggleLike(trackId: number) {
    try {
      const response = await axios.post(`/tracks/${trackId}/like`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  /**
   * Check if a track is liked by the current user
   * @param trackId The ID of the track
   * @returns Promise with like status
   */
  async checkLike(trackId: number) {
    try {
      const response = await axios.get(`/tracks/${trackId}/like`);
      return response.data.data;
    } catch (error) {
      console.error('Error checking like status:', error);
      throw error;
    }
  }

  /**
   * Get track statistics
   * @param trackId The ID of the track
   * @returns Promise with track stats
   */
  async getStats(trackId: number) {
    try {
      const response = await axios.get(`/tracks/${trackId}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting track stats:', error);
      throw error;
    }
  }

  /**
   * Download a track
   * @param trackId The ID of the track
   * @returns Promise with download data
   */
  async downloadTrack(trackId: number) {
    try {
      const response = await axios.post(`/music/${trackId}/download`);
      return response.data.data;
    } catch (error) {
      console.error('Error downloading track:', error);
      throw error;
    }
  }

  /**
   * Share a track
   * @param trackId The ID of the track
   * @returns Promise with share data
   */
  async shareTrack(trackId: number) {
    try {
      const response = await axios.post(`/music/${trackId}/share`);
      return response.data.data;
    } catch (error) {
      console.error('Error sharing track:', error);
      throw error;
    }
  }

  /**
   * Add a track to favorites
   * @param trackId The ID of the track
   * @returns Promise with favorite data
   */
  async toggleFavorite(trackId: number) {
    try {
      const response = await axios.post(`/tracks/${trackId}/favorite`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
}

export default new TrackInteractionService();
