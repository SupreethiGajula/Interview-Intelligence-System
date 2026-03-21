function calculateFinalScore(candidate, weights) {
  return (
    candidate.dsaScore * weights.dsaWeight +
    candidate.systemDesignScore * weights.systemDesignWeight +
    candidate.projectScore * weights.projectWeight +
    candidate.hrScore * weights.hrWeight
  );
}