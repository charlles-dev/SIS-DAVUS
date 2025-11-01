const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors,
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Já existe um registro com esses dados',
      field: err.meta?.target,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
};

module.exports = errorHandler;
