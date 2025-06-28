const supabase = require('../config/database');

// Get feedback statistics
const getStats = async (req, res) => {
  try {
    const { data: allFeedbacks, error } = await supabase
      .from('feedbacks')
      .select('status, category, upvotes');
    
    if (error) {
      throw error;
    }
    
    const stats = {
      total: allFeedbacks.length,
      byStatus: {
        open: allFeedbacks.filter(f => f.status === 'Open').length,
        planned: allFeedbacks.filter(f => f.status === 'Planned').length,
        inProgress: allFeedbacks.filter(f => f.status === 'In Progress').length,
        done: allFeedbacks.filter(f => f.status === 'Done').length
      },
      byCategory: {
        feature: allFeedbacks.filter(f => f.category === 'Feature').length,
        bug: allFeedbacks.filter(f => f.category === 'Bug').length,
        ui: allFeedbacks.filter(f => f.category === 'UI').length,
        enhancement: allFeedbacks.filter(f => f.category === 'Enhancement').length
      },
      totalUpvotes: allFeedbacks.reduce((sum, f) => sum + f.upvotes, 0)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getStats
};