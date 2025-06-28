const supabase = require('../config/database');

// Helper function to validate feedback data
const validateFeedback = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!data.category || data.category.trim() === '') {
    errors.push('Category is required');
  }
  
  const validCategories = ['Feature', 'Bug', 'UI', 'Enhancement'];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push('Invalid category');
  }
  
  return errors;
};

// Helper function to validate status
const validateStatus = (status) => {
  const validStatuses = ['Open', 'Planned', 'In Progress', 'Done'];
  return validStatuses.includes(status);
};

// Get all feedbacks with optional filtering and sorting
const getAllFeedbacks = async (req, res) => {
  try {
    let query = supabase
      .from('feedbacks')
      .select('*');
    
    // Filter by status
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }
    
    // Filter by category
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }
    
    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search;
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    // Sort functionality
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'upvotes':
          query = query.order('upvotes', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: data || [],
      total: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        comments (
          id,
          comment,
          author,
          created_at
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validate input
    const validationErrors = validateFeedback(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          status: 'Open',
          upvotes: 0
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Increment upvote count
const upvoteFeedback = async (req, res) => {
  try {
    // First get current upvote count
    const { data: currentData, error: fetchError } = await supabase
      .from('feedbacks')
      .select('upvotes')
      .eq('id', req.params.id)
      .single();
    
    if (fetchError && fetchError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Increment upvote count
    const { data, error } = await supabase
      .from('feedbacks')
      .update({ upvotes: currentData.upvotes + 1 })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Upvote added successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating upvote:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update feedback status (admin only)
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    if (!validateStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: Open, Planned, In Progress, Done'
      });
    }
    
    const { data, error } = await supabase
      .from('feedbacks')
      .update({ status: status })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Add comment to feedback
const addComment = async (req, res) => {
  try {
    const { comment, author } = req.body;
    
    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }
    
    // Check if feedback exists
    const { data: feedbackExists, error: feedbackError } = await supabase
      .from('feedbacks')
      .select('id')
      .eq('id', req.params.id)
      .single();
    
    if (feedbackError && feedbackError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    if (feedbackError) {
      throw feedbackError;
    }
    
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          feedback_id: req.params.id,
          comment: comment.trim(),
          author: author || 'Anonymous'
        }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: data
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  upvoteFeedback,
  updateFeedbackStatus,
  addComment
};