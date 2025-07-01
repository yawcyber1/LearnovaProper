module.exports = (err, req, res, next) => {
    console.error('🔥 Error:', err.stack || err.message);
  
    res.status(err.status || 500).json({
      error: err.message || 'Something went wrong. Please try again later.'
    });
  };
  