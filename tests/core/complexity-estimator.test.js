const { ComplexityEstimator } = require('../../lib/utils/complexity-estimator');

describe('ComplexityEstimator', () => {
  let estimator;

  beforeEach(() => {
    estimator = new ComplexityEstimator();
  });

  describe('estimateComplexity', () => {
    it('should detect simple work', () => {
      const result = estimator.estimateComplexity('fix button color');
      expect(result).toBe('simple');
    });

    it('should detect simple bug fixes', () => {
      const result = estimator.estimateComplexity('fix typo in README');
      expect(result).toBe('simple');
    });

    it('should detect moderate work', () => {
      const result = estimator.estimateComplexity('refactor authentication module');
      expect(result).toBe('moderate');
    });

    it('should detect moderate with multiple features', () => {
      const result = estimator.estimateComplexity('add authentication dashboard with user management and role permissions');
      expect(result).toBe('moderate');
    });

    it('should detect complex work with app keyword', () => {
      const result = estimator.estimateComplexity('build a full enterprise application');
      expect(result).toBe('complex');
    });

    it('should detect complex work with multiple pages', () => {
      const result = estimator.estimateComplexity('create app with 8 pages for order management');
      expect(result).toBe('complex');
    });

    it('should detect complex work with architecture decisions', () => {
      const result = estimator.estimateComplexity('design architecture for microservices platform');
      expect(result).toBe('complex');
    });

    it('should handle the exact user request from bug report', () => {
      const result = estimator.estimateComplexity(
        'build a fulfilment order management and last and first mile manager app for enterprise'
      );
      expect(result).toBe('complex');
    });
  });

  describe('shouldUseSpecFirst', () => {
    it('should recommend spec-first for complex work', () => {
      const result = estimator.shouldUseSpecFirst('build enterprise app with 8 pages');
      expect(result).toBe(true);
    });

    it('should not recommend spec-first for simple work', () => {
      const result = estimator.shouldUseSpecFirst('fix typo');
      expect(result).toBe(false);
    });

    it('should not recommend spec-first for moderate work', () => {
      const result = estimator.shouldUseSpecFirst('refactor authentication');
      expect(result).toBe(false);
    });
  });

  describe('analyze', () => {
    it('should provide complete analysis for complex work', () => {
      const analysis = estimator.analyze(
        'build a fulfilment order management app with dashboard, orders page, and warehouse management'
      );

      expect(analysis.complexity).toBe('complex');
      expect(analysis.specFirstRecommended).toBe(true);
      expect(analysis.estimatedEffort).toBe('1+ weeks');
      expect(analysis.features.length).toBeGreaterThan(0);
    });

    it('should detect task type as bug-fix', () => {
      const analysis = estimator.analyze('fix authentication bug');
      expect(analysis.taskType).toBe('bug-fix');
    });

    it('should detect task type as feature', () => {
      const analysis = estimator.analyze('add user registration feature');
      expect(analysis.taskType).toBe('feature');
    });

    it('should detect task type as refactor', () => {
      const analysis = estimator.analyze('refactor database layer');
      expect(analysis.taskType).toBe('refactor');
    });

    it('should detect task type as documentation', () => {
      const analysis = estimator.analyze('update API documentation');
      expect(analysis.taskType).toBe('documentation');
    });

    it('should extract features from description', () => {
      const analysis = estimator.analyze('build app with dashboard and analytics');
      expect(analysis.features.length).toBeGreaterThan(0);
    });
  });

  describe('extractFeatures', () => {
    it('should extract features from "with X and Y" pattern', () => {
      const features = estimator.extractFeatures('create app with login and registration');
      expect(features).toContain('login');
      expect(features).toContain('registration');
    });

    it('should extract features from numbered list', () => {
      const features = estimator.extractFeatures(`
        Build app with:
        1. Dashboard
        2. User management
        3. Reports
      `);
      expect(features.length).toBeGreaterThan(0);
    });

    it('should extract features from bullet list', () => {
      const features = estimator.extractFeatures(`
        Features:
        - Dashboard
        - Analytics
        - Reporting
      `);
      expect(features.length).toBeGreaterThan(0);
    });
  });

  describe('getRecommendation', () => {
    it('should recommend spec-first for complex work', () => {
      const analysis = estimator.analyze('build enterprise platform');
      const recommendation = estimator.getRecommendation(analysis);

      expect(recommendation).toContain('spec');
      expect(recommendation).toContain('complex');
    });

    it('should recommend direct implementation for simple work', () => {
      const analysis = estimator.analyze('fix button color');
      const recommendation = estimator.getRecommendation(analysis);

      expect(recommendation).toContain('proceed directly');
    });
  });
});
