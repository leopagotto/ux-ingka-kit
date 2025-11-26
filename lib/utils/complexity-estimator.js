const chalk = require('chalk');

/**
 * Complexity Estimator for Ingvar Workflow
 *
 * Analyzes task descriptions to determine complexity and recommend workflow
 * Implements spec-first decision making from INGVAR Workflow guidelines
 */
class ComplexityEstimator {

  /**
   * Estimate task complexity based on description
   * @param {string} description - Task description
   * @returns {'simple' | 'moderate' | 'complex'} Complexity level
   */
  estimateComplexity(description) {
    const text = description.toLowerCase();
    let score = 0;

    // High complexity indicators (2 points each)
    const highKeywords = [
      'app', 'application', 'system', 'platform', 'enterprise',
      'full', 'complete', 'entire', 'build', 'create from scratch',
      'architecture', 'infrastructure', 'microservice', 'distributed'
    ];

    highKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 2;
    });

    // Medium complexity indicators (1 point each)
    const mediumKeywords = [
      'integrate', 'refactor', 'redesign', 'migrate', 'convert',
      'dashboard', 'admin', 'management', 'authentication', 'authorization'
    ];

    mediumKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 1;
    });

    // Count pages/components/features (1 point per indicator)
    const componentIndicators = ['page', 'screen', 'view', 'component', 'feature', 'module'];
    componentIndicators.forEach(indicator => {
      const matches = text.match(new RegExp(indicator, 'g'));
      if (matches) score += matches.length;
    });

    // Look for numbers indicating multiple items (e.g., "8 pages")
    const numberMatches = text.match(/(\d+)\s*(page|screen|view|component|feature|module)/g);
    if (numberMatches) {
      numberMatches.forEach(match => {
        const num = parseInt(match);
        if (num > 3) score += num;
      });
    }

    // Architecture decision indicators (3 points each)
    const architectureKeywords = [
      'design', 'architecture', 'structure', 'pattern', 'framework',
      'technology stack', 'tech stack', 'database schema', 'api design'
    ];

    architectureKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 3;
    });

    // Classify complexity
    if (score >= 6) return 'complex';
    if (score >= 3) return 'moderate';
    return 'simple';
  }

  /**
   * Determine if spec-first approach is recommended
   * @param {string} description - Task description
   * @returns {boolean} True if spec-first is recommended
   */
  shouldUseSpecFirst(description) {
    const complexity = this.estimateComplexity(description);
    return complexity === 'complex';
  }

  /**
   * Analyze task characteristics
   * @param {string} description - Task description
   * @returns {Object} Analysis results
   */
  analyze(description) {
    const complexity = this.estimateComplexity(description);
    const specFirstRecommended = this.shouldUseSpecFirst(description);
    const text = description.toLowerCase();

    // Detect task type
    let taskType = 'unknown';
    if (text.includes('bug') || text.includes('fix') || text.includes('error')) {
      taskType = 'bug-fix';
    } else if (text.includes('refactor') || text.includes('improve') || text.includes('optimize')) {
      taskType = 'refactor';
    } else if (text.includes('doc') || text.includes('readme') || text.includes('comment')) {
      taskType = 'documentation';
    } else if (text.includes('feature') || text.includes('add') || text.includes('create') || text.includes('build')) {
      taskType = 'feature';
    }

    // Estimate effort (rough)
    let estimatedEffort = '< 1 day';
    if (complexity === 'moderate') estimatedEffort = '2-5 days';
    if (complexity === 'complex') estimatedEffort = '1+ weeks';

    // Count detected features
    const features = this.extractFeatures(description);

    return {
      complexity,
      taskType,
      estimatedEffort,
      specFirstRecommended,
      features,
      score: this.getScore(description)
    };
  }

  /**
   * Extract feature list from description
   * @param {string} description - Task description
   * @returns {string[]} List of features
   */
  extractFeatures(description) {
    const features = [];
    const text = description.toLowerCase();

    // Look for listed features (with numbers or bullets)
    const listPattern = /(?:^|\n)\s*(?:\d+\.|-|\*)\s*(.+?)(?=\n|$)/g;
    let match;
    while ((match = listPattern.exec(text)) !== null) {
      features.push(match[1].trim());
    }

    // Look for "with X and Y" patterns
    const withPattern = /with\s+([^,.]+?)(?:\s+and\s+([^,.]+?))?(?=[,.]|$)/g;
    while ((match = withPattern.exec(text)) !== null) {
      if (match[1]) features.push(match[1].trim());
      if (match[2]) features.push(match[2].trim());
    }

    return features.filter(f => f.length > 3).slice(0, 10); // Limit to 10 features
  }

  /**
   * Get complexity score (internal)
   * @private
   */
  getScore(description) {
    const text = description.toLowerCase();
    let score = 0;

    const allKeywords = [
      'app', 'application', 'system', 'platform', 'enterprise',
      'full', 'complete', 'entire', 'page', 'screen', 'view',
      'component', 'feature', 'module', 'architecture', 'integrate'
    ];

    allKeywords.forEach(keyword => {
      if (text.includes(keyword)) score++;
    });

    return score;
  }

  /**
   * Display analysis results to console
   * @param {Object} analysis - Analysis results
   */
  displayAnalysis(analysis) {
    console.log(chalk.cyan('\n📊 Task Complexity Analysis\n'));

    const complexityColor = {
      'simple': chalk.green,
      'moderate': chalk.yellow,
      'complex': chalk.red
    }[analysis.complexity] || chalk.gray;

    console.log(`   Complexity: ${complexityColor(analysis.complexity.toUpperCase())}`);
    console.log(`   Task Type: ${chalk.blue(analysis.taskType)}`);
    console.log(`   Estimated Effort: ${chalk.gray(analysis.estimatedEffort)}`);

    if (analysis.features.length > 0) {
      console.log(`   Detected Features: ${chalk.gray(analysis.features.length)}`);
      analysis.features.slice(0, 5).forEach(feature => {
        console.log(chalk.gray(`     • ${feature}`));
      });
      if (analysis.features.length > 5) {
        console.log(chalk.gray(`     ... and ${analysis.features.length - 5} more`));
      }
    }

    console.log();

    // Recommendation
    if (analysis.specFirstRecommended) {
      console.log(chalk.yellow.bold('🏗️  SPEC-FIRST RECOMMENDED\n'));
      console.log(chalk.gray('   This is complex work (>1 week effort)'));
      console.log(chalk.gray('   Architecture decisions required'));
      console.log(chalk.gray('   Multiple components/features detected\n'));
      console.log(chalk.cyan('   Recommended workflow:'));
      console.log(chalk.gray('   1. Create specification document'));
      console.log(chalk.gray('   2. Review with stakeholders'));
      console.log(chalk.gray('   3. Break into smaller issues'));
      console.log(chalk.gray('   4. Implement incrementally\n'));
    } else {
      console.log(chalk.green.bold('✅ DIRECT IMPLEMENTATION OK\n'));
      console.log(chalk.gray('   Simple work (<1 week effort)'));
      console.log(chalk.gray('   Clear solution path'));
      console.log(chalk.gray('   Can proceed directly\n'));
    }
  }

  /**
   * Get workflow recommendation message
   * @param {Object} analysis - Analysis results
   * @returns {string} Recommendation message
   */
  getRecommendation(analysis) {
    if (analysis.specFirstRecommended) {
      return `This appears to be complex work (estimated ${analysis.estimatedEffort}).

Recommended approach:
1. Create specification document in docs/specs/
2. Review architecture decisions with team
3. Get approval before proceeding
4. Break into smaller trackable issues

This follows the spec-first workflow for complex work.`;
    } else {
      return `This appears to be ${analysis.complexity} work (estimated ${analysis.estimatedEffort}).

You can proceed directly with implementation.`;
    }
  }
}

module.exports = { ComplexityEstimator };
